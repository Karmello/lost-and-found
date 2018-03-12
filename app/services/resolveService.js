var resolveService = function($rootScope, $q, $state, authService, hardDataService) {

  return {
    isAuthenticated: function(currentStateName) {

      var hardData = hardDataService.get();

      return $q(function(resolve, reject) {

        if (authService.state.authenticated) {
          resolve();

        } else {

          reject();

          if (currentStateName == 'app.start') {
            $rootScope.$broadcast('infoModalShow', {
              title: hardData.status[5],
              message: hardData.rejections[0]
            });

          } else {
            $state.go('app.start', { tab: 'status' }, { location: 'replace' });
          }
        }
      });
    }
  };
};

resolveService.$inject = ['$rootScope', '$q', '$state', 'authService', 'hardDataService'];
angular.module('appModule').service('resolveService', resolveService);