(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.search', {
			url: '/search',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('search');
				ui.frames.main.activateSwitcher('search');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();