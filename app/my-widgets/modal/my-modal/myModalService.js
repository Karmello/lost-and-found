var myModalService = function($rootScope, hardDataService) {

  var service = {
    showCustom: function(id, additionalConfig) {

      var hardData = hardDataService.get();

      switch (id) {
        case 'tryAgainLaterModal':
          var config = Object.assign({ title: hardData.status[6], message: hardData.rejections[1] }, additionalConfig);
          $rootScope.$broadcast('infoModalShow', config);
          break;
      }
    }
  };

  return service;
};

myModalService.$inject = ['$rootScope', 'hardDataService'];
angular.module('appModule').service('myModalService', myModalService);