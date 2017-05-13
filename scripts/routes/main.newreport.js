(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.newreport', {
			url: '/newreport',
			resolve: {
				_ui: function(reportCategories, $q, ui)	 {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher('newreport');
						ui.frames.main.activateSwitcher('newreport');
						resolve();
					});
				}
			},
			onEnter: function() {}
		});
	});

})();