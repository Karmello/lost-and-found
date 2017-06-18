(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $timeout, reportFormService, ReportsRest) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/reportForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.ui = $rootScope.ui;
				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.autocomplete = {};
				$scope.minDate = new Date(2000, 0, 1);

				$scope.myForm = reportFormService.getForm($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'addReport':

							if (!$rootScope.$$listeners.onAddReportFormShow) {

								$rootScope.$on('onAddReportFormShow', function(e, args) {

									var date = reportFormService.getCurrentDateWithNoTime();
									ReportsRest.addReportModel.set({ startEvent: { date: date } }, true);
								});
							}

							$rootScope.$broadcast('onAddReportFormShow');

							break;

						case 'respondToReport':

							if (!$rootScope.$$listeners.onRespondToReportFormShow) {

								$rootScope.$on('onRespondToReportFormShow', function(e, args) {

									var date = reportFormService.getCurrentDateWithNoTime();
									ReportsRest.respondToReportModel.set({ date: date }, true);
								});
							}

							break;

						case 'editReport':

							if (!$rootScope.$$listeners.onEditReportFormShow) {

								$rootScope.$on('onEditReportFormShow', function(e, args) {

									ReportsRest.editReportModel.set($rootScope.apiData.report.plain(), true);
									$timeout(function() { scope.myForm.scope.loader.stop(); });
								});
							}

							break;
					}
				};
			}
		};

		return reportForm;
	});

})();