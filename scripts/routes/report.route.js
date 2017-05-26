(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report', {
			url: '/report?id&edit',
			resolve: {
				isAuthenticated: function(authentication, resolveService, $state) {
					return resolveService.isAuthenticated($state.current.name);
				},
				apiData: function(isAuthenticated, $q, $rootScope, $state, $stateParams, $timeout, UsersRest, ReportsRest, authService, ui) {

					return $q(function(resolve, reject) {

						if (authService.state.authenticated) {

							var promises = [];

							promises.push(UsersRest.getList({ reportId: $stateParams.id }));
							promises.push(ReportsRest.getList({ _id: $stateParams.id, subject: 'report' }));

							$q.all(promises).then(function(results) {
								$timeout(function() { resolve(true); });

							}, function() {
								reject();
								$state.go('app.home');
							});

						} else { reject(); }
					});
				}
			},
			onEnter: function(apiData, $rootScope, $timeout, $stateParams, googleMapService, ui) {

				if (apiData) {

					if ($stateParams.edit === '1') {
						$rootScope.$broadcast('editReport', { report: $rootScope.apiData.report });

					} else {
						googleMapService.singleReportMap.init($rootScope.apiData.report);
					}

					$timeout(function() {
						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('report');
						ui.frames.app.activateSwitcher('main');
						ui.loaders.renderer.stop();
					});
				}
			}
		});
	});

})();