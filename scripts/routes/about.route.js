(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.about', {
			url: '/about',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('about');
				ui.menus.top.activateSwitcher('about');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();