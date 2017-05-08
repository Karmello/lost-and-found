(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.report', {
			url: '/report',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('report');
				ui.menus.top.activateSwitcher('report');
			}
		});
	});

})();