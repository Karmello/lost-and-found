(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.report', {
			url: '/report',
			resolve: {
				_ui: function(itemCategories, $q, ui)	 {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher('report');
						ui.frames.main.activateSwitcher('report');
						resolve();
					});
				}
			},
			onEnter: function() {

			}
		});
	});

})();