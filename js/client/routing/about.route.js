(function() {

  angular.module('appModule').config(function($stateProvider) {

    $stateProvider.state('app.about', {
      url: '/about',
      resolve: {
        isAuthenticated: function(authentication, resolveService) {
          return resolveService.isAuthenticated();
        }
      },
      onEnter: function(ui) {

        ui.frames.main.activateSwitcher('about');
        ui.menus.top.activateSwitcher('about');
        ui.frames.app.activateSwitcher('main');
        ui.loaders.renderer.stop();
      }
    });
  });

})();