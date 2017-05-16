(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.newreport', {
			url: '/newreport',
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('newreport');
				ui.frames.main.activateSwitcher('newreport');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();