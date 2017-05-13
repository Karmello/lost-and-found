(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.report.tab', {
			url: '/:tab',
			onEnter: function($stateParams, ui) {

				ui.tabs.report.activateSwitcher($stateParams.tab);
			}
		});
	});

})();