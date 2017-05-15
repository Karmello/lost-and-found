(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.contact', {
			url: '/contact',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('contact');
				ui.menus.top.activateSwitcher('contact');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();