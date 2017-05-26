(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.newreport', {
			url: '/newreport',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function($rootScope, ui) {

				$rootScope.$broadcast('newReport');

				ui.menus.top.activateSwitcher('newreport');
				ui.frames.main.activateSwitcher('newreport');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			}
		});
	});

})();