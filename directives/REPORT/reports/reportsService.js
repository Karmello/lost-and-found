(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $timeout, $q, reportsConf) {

		var service = this;

		service.deleteReports = function(reports) {

			if (reports && reports.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteReportModal.show({
					title: $rootScope.ui.modals.deleteReportModal.title + ' (' + reports.length + ')',
					message: $rootScope.hardData.warnings[2],
					acceptCb: function() {

						var promises = [];
						for (var report of reports) { promises.push(report.remove()); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'app.profile':
									$rootScope.$broadcast('initUserReports', { userId: $stateParams.id });
									break;

								case 'app.report':
									$state.go('app.profile', { _id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });
									$timeout(function() { $rootScope.$broadcast('initUserReports', { userId: $stateParams.id }); });
									break;
							}
						});
					}
				});
			}
		};

		service.initUserReports = function(scope, userId) {

			scope.collectionBrowser = reportsConf.userReports;

			if (userId == $rootScope.apiData.loggedInUser._id) {
				scope.elemContextMenuConf = scope.reportContextMenuConf;

			} else {
				scope.elemContextMenuConf = undefined;
			}

			scope.collectionBrowser.onRefreshClick();
		};

		return service;
	};



	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'reportsConf'];
	angular.module('appModule').service('reportsService', reportsService);

})();