angular.module('appModule').directive('userAvatar', function(userAvatarService, userAvatarConf, MySrc, ui) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/userAvatar.html',
    scope: {
      user: '=',
      editable: '=',
      noLink: '&',
      withLabel: '=',
      noLoader: '<'
    },
    controller: function($scope) {

      $scope.src = new MySrc({
        defaultUrl: userAvatarConf.defaultUrl,
        uploadRequest: userAvatarService.uploadRequest,
        removeRequest: userAvatarService.removeRequest
      });

      $scope.srcContextMenuConf = userAvatarConf.getSrcContextMenuConf($scope);
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        scope.$watch(function() { return scope.user; }, function(user) {

          if (user) {
            if (scope.withLabel) { scope.src.label = scope.user.username.truncate(15); }
            if (!scope.noLink()) { scope.src.href = '/#/profile?id=' + scope.user._id; }
            userAvatarService.loadPhoto(scope);

          } else {
            scope.src.url = undefined;
          }
        });
      };
    }
  };
});