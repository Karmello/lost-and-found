(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.about', {
			url: '/about',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('about');
				ui.menus.top.activateSwitcher('about');
			}
		});
	});

})();