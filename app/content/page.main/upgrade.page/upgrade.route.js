angular.module('appModule').config(function($stateProvider) {

  $stateProvider.state('app.upgrade', {
    url: '/upgrade?id',
    resolve: {
      isAuthenticated: function(authentication, resolveService) {
        return resolveService.isAuthenticated();
      },
      id: function(isAuthenticated, $q, $rootScope, $state, $stateParams, authService) {

        return $q(function(resolve, reject) {

          if (!$stateParams.id) {

            if (authService.state.authenticated) {
              reject();
              $state.go('app.upgrade', { id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });

            } else {
              reject();
              $state.go('app.start', { tab: 'status' }, { location: 'replace' });
            }

          } else { resolve(); }
        });
      },
      getPayment: function(id, $q, $http, $rootScope, $moment, storageService, ui, myModalService) {

        return $q(function(resolve, reject) {

          if ($rootScope.apiData.loggedInUser.paymentId) {

            var config = {
              paymentId: $rootScope.apiData.loggedInUser.paymentId,
              headers: { 'x-access-token': storageService.authToken.getValue() }
            };

            $http.get('/paypal/payment', config).success(function(res) {
              res.create_time = $moment(res.create_time).format('DD-MM-YYYY, HH:mm');
              $rootScope.apiData.payment = res;

            }).error(function(res) {
              myModalService.showCustom('tryAgainLaterModal');
            });
          }

          resolve();
        });
      }
    },
    onEnter: function(ui) {

      ui.menus.top.activateSwitcher();
      ui.frames.main.activateSwitcher('upgrade');
      ui.frames.app.activateSwitcher('main');
      ui.loaders.renderer.stop();
    }
  });
});