(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.home', {
			url: '/home',
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				},
				apiData: function(isAuthenticated, $q, $http, $rootScope) {

					return $q(function(resolve) {

						$http.get('/stats').success(function(res) {
							$rootScope.apiData.stats = res;
							resolve(true);

						}).error(function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher('home');
				ui.frames.main.activateSwitcher('home');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();