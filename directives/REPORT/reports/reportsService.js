(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $q, reportsConf) {

		var service = this;

		service.deleteReports = function(reports) {

			if (reports && reports.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteReportModal.show({
					message: (function() { return $rootScope.hardData.warnings[2]; })(),
					acceptCb: function() {

						var promises = [];
						for (var report of reports) { promises.push(report.remove({ userId: report.userId })); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'app.profile':
									$rootScope.$broadcast('initUserReports', { userId: $stateParams.id });
									break;

								case 'app.report':
									window.history.back();
									break;
							}
						});
					}
				});
			}
		};

		service.initUserReports = function(scope, userId) {

			scope.collectionBrowser = reportsConf.profileCollectionBrowser;

			if (userId == $rootScope.apiData.loggedInUser._id) {
				scope.elemContextMenuConf = scope.reportContextMenuConf;

			} else {
				$scope.elemContextMenuConf = undefined;
			}

			scope.collectionBrowser.onRefreshClick();
		};

		return service;
	};



	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$q', 'reportsConf'];
	angular.module('appModule').service('reportsService', reportsService);

})();