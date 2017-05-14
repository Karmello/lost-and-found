(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.home', {
			url: '/home',
			resolve: {
				getStats: function($http, $rootScope) {

					return $http.get('/stats').then(function(res) {
						$rootScope.apiData.stats = res.data;
					});
				}
			},
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('home');
				ui.frames.main.activateSwitcher('home');
			}
		});
	});

})();