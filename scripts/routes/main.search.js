(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.search', {
			url: '/search',
			resolve: {
				_ui: function(itemCategories, $q, ui) {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher('search');
						ui.frames.main.activateSwitcher('search');

						resolve();
					});
				}
			},
			onEnter: function($rootScope) {

				//$rootScope.$broadcast('initSearchItems');
			}
		});
	});

})();