(function() {

  angular.module('appModule').config(function($stateProvider) {

    $stateProvider.state('app.help', {
      url: '/help',
      resolve: {
        isAuthenticated: function(authentication, resolveService) {
          return resolveService.isAuthenticated();
        }
      },
      onEnter: function(ui) {

        ui.frames.main.activateSwitcher('help');
        ui.menus.top.activateSwitcher('help');
        ui.frames.app.activateSwitcher('main');
        ui.loaders.renderer.stop();
      }
    });
  });

})();