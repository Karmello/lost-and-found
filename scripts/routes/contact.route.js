(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.contact', {
			url: '/contact',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				}
			},
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('contact');
				ui.menus.top.activateSwitcher('contact');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();