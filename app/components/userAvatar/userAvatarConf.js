var userAvatarConf = function($rootScope, userAvatarService, utilService) {

  var conf = {
    defaultUrl: 'public/imgs/avatar.png',
    getSrcContextMenuConf: function(scope) {

      return {
        icon: 'glyphicon glyphicon-option-horizontal',
        isHidden: function() {
          return !scope.user._isTheOneLoggedIn();
        },
        switchers: [
          {
            _id: 'update',
            label: $rootScope.hardData.imperatives[5],
            onClick: function() {

              $rootScope.$broadcast('displayMyImgCropModal', {
                acceptCb: function(dataURI) {

                  scope.src.update({ file: utilService.dataURItoBlob(dataURI), doReload: true }).then(function(success) {
                    if (success) { userAvatarService.loadPhoto(scope, true); }
                  });
                }
              });
            }
          },
          {
            _id: 'delete',
            label: $rootScope.hardData.imperatives[14],
            onClick: function() {

              scope.src.remove(undefined, true);
            },
            isHidden: function() { return scope.src.isDefaultUrlLoaded(); }
          },
          {
            _id: 'refresh',
            label: $rootScope.hardData.imperatives[19],
            onClick: function() {

              userAvatarService.loadPhoto(scope, true);
            }
          }
        ]
      };
    }
  };

  return conf;
};

userAvatarConf.$inject = ['$rootScope', 'userAvatarService', 'utilService'];
angular.module('appModule').service('userAvatarConf', userAvatarConf);