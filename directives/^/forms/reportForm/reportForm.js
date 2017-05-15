(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $state, $stateParams, $timeout, googleMapService, myClass, ReportsRest, Restangular) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportForm/reportForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.ui = $rootScope.ui;
				$scope.hardData = $rootScope.hardData;

				$scope.minDate = new Date(2000, 0, 1);
				$scope.maxDate = new Date();
				$scope.autocomplete = {};

				$scope.reportGroups = $rootScope.hardData.reportGroups;
				$scope.reportCategories = $rootScope.apiData.reportCategories;

				var modelFields = ['userId', 'date', 'placeId', 'details', 'group', 'categoryId', 'subcategoryId',
									'title', 'serialNo', 'description'];

				$scope.myModel = new myClass.MyFormModel('reportForm', modelFields, true);

				var date = new Date();
				date.setHours(12);
				date.setMinutes(0);
				date.setSeconds(0);
				date.setMilliseconds(0);
				$scope.myModel.set({ date: date });

				$scope.myForm = new myClass.MyForm({ ctrlId: 'reportForm', model: $scope.myModel });

				$scope.myForm.submitAction = function(args) {

					switch ($scope.action) {

						case 'newreport':

							$scope.myModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));

							if (!$scope.myModel.getValue('date')) {
								$scope.myModel.setValue('date', $scope.myModel.defaults.date);
							}

							$scope.myForm.submitSuccessCb = function(res) {
								googleMapService.reportPlace = null;
								$scope.myForm.reset();
								$state.go('app.report', { id: res.data._id });
							};

							// Making http request
							var modelValues = $scope.myModel.getValues();
							var place = $scope.autocomplete.ins.getPlace();
							if (place) { modelValues.placeId = place.place_id; } else { modelValues.placeId = null; }
							return ReportsRest.post(modelValues);

						case 'edit':

							// Making copy of active report
							var copy = Restangular.copy($rootScope.apiData.report);

							// Updating model values
							$scope.myModel.setRestObj(copy);

							$scope.myForm.submitSuccessCb = function(res) {
								googleMapService.reportPlace = null;
								$rootScope.apiData.report = res.data;
								$state.go('app.report', { id: res.data._id, edit: undefined });
							};

							$scope.myForm.submitErrorCb = function(res) {
								$rootScope.apiData.report = copy;
							};

							// Making request
							return copy.put();
					}
				};

				$scope.myForm.onCancel = function() {
					window.history.back();
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'edit':

							if (!$rootScope.$$listeners.editReport) {

								$rootScope.$on('editReport', function(e, args) {

									if (args.report) {
										scope.myModel.setWithRestObj(args.report);
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