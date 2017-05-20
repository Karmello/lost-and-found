(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.search', {
			url: '/search',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function($timeout, googleMapService, ui) {

				ui.menus.top.activateSwitcher('search');
				ui.frames.main.activateSwitcher('search');
				ui.frames.app.activateSwitcher('main');

				var timeout = 0;
				if (ui.loaders.renderer.isLoading) { timeout = 4000; }
				$timeout(function() { googleMapService.searchReportsMap.init(); }, timeout);
			}
		});
	});

})();