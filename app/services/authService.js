var authService = function(
  $rootScope, $window, $q, $state, storageService, sessionConst, UsersRest) {

  var service = {
    state: {
      authenticated: false,
      loggedIn: false
    },
    authenticate: function() {

      return $q(function(resolve) {

        // Token not authenticated yet
        if (!service.state.authenticated) {

          var authToken = storageService.authToken.getValue();

          // Auth token found
          if (authToken) {

            UsersRest.post(undefined, { action: 'authenticate' }, { 'x-access-token': authToken }).then(function(res) {

              // Successful authentication
              service.setAsLoggedIn(function() {
                resolve(true);
              });

            }, function(res) {

              // Could not authenticate
              service.setAsLoggedOut(function() {
                resolve(false);
              });
            });

            // No auth token
          } else {

            service.setAsLoggedOut(function() {
              resolve(false);
            });
          }

          // Already authenticated
        } else {

          service.state.loggedIn = true;
          resolve(true);
        }
      });
    },
    logout: function(extraParams, cb) {
      service.setAsLoggedOut(function() {
        var params = { tab: 'login' };
        if (extraParams) { Object.assign(params, extraParams); }
        $state.go('app.start', params);
        if (cb) { cb(); }
      });
    },
    setAsLoggedIn: function(cb) {

      // Updating state variables
      service.state.authenticated = true;
      service.state.loggedIn = true;

      var loggedInUser = $rootScope.apiData.loggedInUser;

      if (loggedInUser.config.language != sessionConst.language || loggedInUser.config.theme != sessionConst.theme) {
        $window.location.reload();

      } else if (cb) {
        cb();
      }
    },
    setAsLoggedOut: function(cb) {

      // Updating service state variables
      service.state.authenticated = false;
      service.state.loggedIn = false;

      // Updating other services variables
      storageService.authToken.remove();
      $rootScope.apiData.loggedInUser = undefined;
      $rootScope.apiData.payment = undefined;

      if (cb) { cb(); }
    }
  };

  return service;
};

authService.$inject = ['$rootScope', '$window', '$q', '$state', 'storageService', 'sessionConst', 'UsersRest'];
angular.module('appModule').service('authService', authService);