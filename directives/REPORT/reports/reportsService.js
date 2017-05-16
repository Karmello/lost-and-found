(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $timeout, $q, Restangular) {

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

		return service;
	};



	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'Restangular'];
	angular.module('appModule').service('reportsService', reportsService);

})();