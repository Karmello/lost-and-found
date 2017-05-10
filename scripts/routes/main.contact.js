(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.contact', {
			url: '/contact',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('contact');
				ui.menus.top.activateSwitcher('contact');
			}
		});
	});

})();