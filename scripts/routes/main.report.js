(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.report', {
			url: '/report?id&edit',
			views: {
				tab: {
					templateUrl: 'public/pages/lost-and-found-app-report-tab.html'
				}
			},
			resolve: {
				getReport: function(reportCategories, $stateParams, $q, ReportsRest) {

					return $q(function(resolve) {

						ReportsRest.getList({ _id: $stateParams.id, subject: 'report' }).then(function(res) {
							resolve(res.data[0]);

						}, function() {
							resolve(false);
						});
					});
				},
				getUser: function(getReport, $stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ reportId: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(getReport, getUser, $rootScope, $stateParams, $timeout, googleMapService, ui) {

				var timeout = 0;
				if (ui.loaders.renderer.isLoading) { timeout = 3000; }

				$timeout(function() {

					ui.menus.top.activateSwitcher();

					if (getReport && getUser) {

						ui.frames.main.activateSwitcher('report');

						if ($stateParams.edit === '1') {
							$rootScope.$broadcast('editReport', { report: getReport });

						} else {
							googleMapService.initReportMap(getReport.placeId);
						}

					} else {
						ui.frames.main.activateSwitcher();
						ui.modals.tryAgainLaterModal.show();
					}

				}, timeout);
			}
		});
	});

})();