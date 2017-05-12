(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.item.tab', {
			url: '/:tab',
			onEnter: function($stateParams, ui) {

				ui.tabs.item.activateSwitcher($stateParams.tab);
			}
		});
	});

})();