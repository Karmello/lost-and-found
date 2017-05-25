(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $timeout, myClass, reportFormService, ReportsRest) {

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

				$scope.myForm = new myClass.MyForm({
					ctrlId: $scope.action + 'Form',
					model: ReportsRest[$scope.action + 'Model'],
					submitAction: reportFormService.getFormSubmitAction($scope),
					onCancel: function() {

						$timeout(function() { $scope.myForm.reset(); });
						window.history.back();
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'editReport':

							if (!$rootScope.$$listeners.editReport) {

								$rootScope.$on('editReport', function(e, args) {

									if (args.report) {

										ReportsRest.editReportModel.set(args.report.plain(), true);

										var geocoder = new google.maps.Geocoder();

										geocoder.geocode({ 'placeId': args.report.startEvent.placeId }, function(results, status) {
											ReportsRest.editReportModel.setValue('startEvent.geolocation', results[0].formatted_address, true);
										});
									}
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.editReport = null;
							});

							break;

						case 'newReport':

							var setMaxDate = function(scope) {
								var date = new Date();
								scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
							};

							setMaxDate(scope);
							ReportsRest.newReportModel.set({ startEvent: { date: scope.maxDate } }, true);

							if (!$rootScope.$$listeners.newReport) {
								$rootScope.$on('newReport', function(e, args) { setMaxDate(scope); });
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.newReport = null;
							});

							break;
					}
				};
			}
		};

		return reportForm;
	});

})();