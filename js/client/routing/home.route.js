(function() {

  angular.module('appModule').config(function($stateProvider) {

    $stateProvider.state('app.home', {
      url: '/home',
      resolve: {
        isAuthenticated: function(authentication, resolveService) {
          return resolveService.isAuthenticated();
        }
      },
      onEnter: function($rootScope, ui) {

        ui.menus.top.activateSwitcher('home');
        ui.frames.main.activateSwitcher('home');
        ui.frames.app.activateSwitcher('main');
        ui.loaders.renderer.stop();
      }
    });
  });

})();