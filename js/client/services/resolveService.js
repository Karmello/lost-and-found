(function() {

  'use strict';

  var resolveService = function($q, $state, authService, ui) {

    return {
      isAuthenticated: function(currentStateName) {

        return $q(function(resolve, reject) {

          if (authService.state.authenticated) {
            resolve();

          } else {

            reject();

            if (currentStateName == 'app.start') {
              ui.modals.accountRequiredModal.show();

            } else {
              $state.go('app.start', { tab: 'status' }, { location: 'replace' });
            }
          }
        });
      }
    };
  };

  resolveService.$inject = ['$q', '$state', 'authService', 'ui'];
  angular.module('appModule').service('resolveService', resolveService);

})();