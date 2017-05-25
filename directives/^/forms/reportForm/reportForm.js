(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $timeout, myClass, reportsService, ReportsRest) {

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

				var date = new Date();
				$scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
				$scope.minDate = new Date(2000, 0, 1);

				$scope.myModel = ReportsRest.reportModel;
				$scope.myModel.set({ date: $scope.maxDate }, true);

				$scope.myForm = new myClass.MyForm({
					ctrlId: $scope.action + 'Form',
					model: $scope.myModel,
					submitAction: reportsService.getFormSubmitAction($scope),
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

										var geocoder = new google.maps.Geocoder();

										geocoder.geocode({ 'placeId': args.report.startEvent.placeId }, function(results, status) {

											scope.myModel.set({
												title: args.report.title,
												categoryId: args.report.categoryId,
												subcategoryId: args.report.subcategoryId,
												subsubcategoryId: args.report.subsubcategoryId,
												serialNo: args.report.serialNo,
												description: args.report.description,
												group: args.report.startEvent.group,
												date: args.report.startEvent.date,
												geolocation: results[0].formatted_address,
												details: args.report.startEvent.details
											});
										});
									}
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.editReport = null;
							});

							break;
					}
				};
			}
		};

		return reportForm;
	});

})();