(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report', {
			url: '/report?id&edit',
			resolve: {
				isAuthenticated: function(authentication, resolveService, $state) {
					return resolveService.isAuthenticated($state.current.name);
				},
				apiData: function(isAuthenticated, $q, $rootScope, $state, $stateParams, UsersRest, ReportsRest) {

					return $q(function(resolve, reject) {

						var promises = [];

						promises.push(UsersRest.getList({ reportId: $stateParams.id }));
						promises.push(ReportsRest.getList({ _id: $stateParams.id, subject: 'singleReport' }));

						$q.all(promises).then(function(results) {
							$rootScope.apiData.reportUser = results[0].data[0];
							$rootScope.apiData.report = results[1].data[0];
							resolve();

						}, function() {
							reject();
							$state.go('app.home', undefined, { location: 'replace' });
						});
				});
				}
			},
			onEnter: function($rootScope, $timeout, $stateParams, googleMapService, reportFormService, ui) {

				if ($stateParams.edit === '1') {
					$rootScope.$broadcast('editReport', { report: $rootScope.apiData.report });

				} else {
					googleMapService.singleReportMap.init($rootScope.apiData.report);
				}

				if (reportFormService.ins.scope) { reportFormService.ins.scope.loader.start(); }

				$timeout(function() {
					ui.menus.top.activateSwitcher();
					ui.frames.main.activateSwitcher('report');
					ui.frames.app.activateSwitcher('main');
					ui.loaders.renderer.stop();
				});
			}
		});
	});

})();