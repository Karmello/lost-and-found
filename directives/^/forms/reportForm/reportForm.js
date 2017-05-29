(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, reportFormService, ReportsRest) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportForm/reportForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.ui = $rootScope.ui;
				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.autocomplete = {};
				$scope.minDate = new Date(2000, 0, 1);

				$scope.myForm = reportFormService.createFormIns($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'addReport':

							reportFormService.setMaxDate(scope);
							ReportsRest.addReportModel.set({ startEvent: { date: scope.maxDate } }, true);

							if (!$rootScope.$$listeners.addReport) {
								$rootScope.$on('addReport', function(e, args) { reportFormService.setMaxDate(scope); });
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.addReport = null;
							});

							break;

						case 'editReport':

							if (!$rootScope.$$listeners.editReport) {

								$rootScope.$on('editReport', function(e, args) {

									if (args.report) {

										var geocoder = new google.maps.Geocoder();

										geocoder.geocode({ 'placeId': args.report.startEvent.placeId }, function(results, status) {
											ReportsRest.editReportModel.set(args.report.plain(), true);
											ReportsRest.editReportModel.setValue('startEvent.geolocation', results[0].formatted_address, true);
											scope.myForm.scope.loader.stop();
										});
									}
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.editReport = null;
							});

							break;

						case 'respondToReport':

							reportFormService.setMaxDate(scope);
							ReportsRest.respondToReportModel.set({ group: 'lost', date: scope.maxDate }, true);

							if (!$rootScope.$$listeners.respondToReport) {
								$rootScope.$on('respondToReport', function(e, args) { reportFormService.setMaxDate(scope); });
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.respondToReport = null;
							});

							break;
					}
				};
			}
		};

		return reportForm;
	});

})();