(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.search', {
			url: '/search',
			resolve: {
				_ui: function($q, ui) {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher('search');
						ui.frames.main.activateSwitcher('search');
						ui.frames.app.activateSwitcher('main');

						resolve();
					});
				}
			},
			onEnter: function($rootScope) {


			}
		});
	});

})();