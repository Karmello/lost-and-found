(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.report', {
			url: '/report?id&edit',
			resolve: {
				isAuthenticated: function(authentication, resolveService, $state) {

					return resolveService.isAuthenticated($state.current.name);
				},
				apiData: function(isAuthenticated, $q, $rootScope, $timeout, $state, $stateParams, UsersRest, ReportsRest) {

					return $q(function(resolve, reject) {

						$rootScope.apiData.report = undefined;

						var promises = [];

						promises.push(UsersRest.getList({ reportId: $stateParams.id }));
						promises.push(ReportsRest.getList({ _id: $stateParams.id, subject: 'singleOne' }));

						$q.all(promises).then(function(results) {

							$rootScope.apiData.reportUser = results[0].data[0];
							$rootScope.apiData.report = results[1].data[0];

							$timeout(() => { resolve(); });

						}, function() {
							reject();
							$state.go('app.home', undefined, { location: 'replace' });
						});
				});
				}
			},
			onEnter: function($rootScope, $stateParams, $timeout, ui, googleMapService) {

				if ($stateParams.edit === '1') {
					$rootScope.$broadcast('onEditReportFormShow');

				} else {
					googleMapService.singleReportMap.init($rootScope.apiData.report);
				}

				ui.menus.top.activateSwitcher();
				ui.frames.main.activateSwitcher('report');
				ui.frames.app.activateSwitcher('main');
				ui.loaders.renderer.stop();
			},
			onExit: function($rootScope, ReportsRest, reportFormService) {

				$rootScope.$broadcast('toggleRespondToReportForm', { visible: false });

				ReportsRest.editReportModel.reset(true, true);
				reportFormService.editReportForm.scope.loader.start();
			}
		});
	});

})();