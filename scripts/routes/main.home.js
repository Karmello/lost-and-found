(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.home', {
			url: '/home',
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('home');
				ui.frames.main.activateSwitcher('home');
			}
		});
	});

})();