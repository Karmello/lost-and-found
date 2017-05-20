(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report', {
			url: '/report?id&edit',
			views: {
				tab: {
					templateUrl: 'public/pages/lost-and-found-app-report-tab.html'
				}
			},
			resolve: {
				isAuthenticated: function(authentication, resolveService) {
					return resolveService.isAuthenticated();
				},
				apiData: function(isAuthenticated, $q, $rootScope, $stateParams, $timeout, UsersRest, ReportsRest, authService, ui) {

					return $q(function(resolve, reject) {

						if (authService.state.authenticated) {

							var promises = [];

							promises.push(UsersRest.getList({ reportId: $stateParams.id }));
							promises.push(ReportsRest.getList({ _id: $stateParams.id, subject: 'report' }));

							$q.all(promises).then(function(results) {
								$timeout(function() { resolve(true); });

							}, function() {
								reject();
							});

						} else {

							reject();
							ui.modals.accountRequiredModal.show();
						}
					});
				}
			},
			onEnter: function(apiData, $rootScope, $stateParams, googleMapService, ui) {

				if (apiData) {

					if ($stateParams.edit === '1') {
						$rootScope.$broadcast('editReport', { report: $rootScope.apiData.report });

					} else {
						googleMapService.initReportMap($rootScope.apiData.report.placeId);
					}

					ui.menus.top.activateSwitcher();
					ui.frames.main.activateSwitcher('report');
					ui.frames.app.activateSwitcher('main');
				}
			}
		});
	});

})();