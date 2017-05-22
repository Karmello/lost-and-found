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
				$scope.reportGroups = $rootScope.hardData.reportGroups;
				$scope.reportCategories = $rootScope.apiData.reportCategories;

				$scope.autocomplete = {
					onPlaceChanged: function() {

						var place = $scope.autocomplete.ins.getPlace();
						$scope.autocomplete.icon = place.icon;
						$scope.autocomplete.label = place.formatted_address;
						$scope.$apply();
					}
				};

				var date = new Date();
				$scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
				$scope.minDate = new Date(2000, 0, 1);

				var modelFields = ['userId', 'date', 'geolocation', 'details', 'group', 'categoryId', 'subcategoryId', 'title', 'serialNo', 'description'];
				$scope.myModel = new myClass.MyFormModel('reportForm', modelFields, true, function() {
					if ($scope.autocomplete.init) { $scope.autocomplete.init(); }
				});



				switch ($scope.action) {

					case 'newreport':

						$scope.myForm = new myClass.MyForm({
							ctrlId: 'reportForm',
							model: $scope.myModel,
							submitAction: function(args) {

								$scope.myForm.submitSuccessCb = function(res) {
									$scope.myForm.reset();
									$state.go('app.report', { id: res.data._id });
								};

								$scope.myModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));

								var modelValues = $scope.myModel.getValues();
								var place = $scope.autocomplete.ins.getPlace();

								if (place) {
									modelValues.geolocation = {
										lat: place.geometry.location.lat(),
										lng: place.geometry.location.lng()
									};

								} else {
									modelValues.geolocation = null;
								}

								return ReportsRest.post(modelValues);
							},
							onCancel: function() {

								window.history.back();
							}
						});

						$scope.myModel.set({ date: $scope.maxDate });

						break;

					case 'edit':

						$scope.myForm = new myClass.MyForm({
							ctrlId: 'reportForm',
							model: $scope.myModel,
							submitAction: function(args) {

								// Making copy of active report
								var copy = Restangular.copy($rootScope.apiData.report);

								// Updating model values
								$scope.myModel.setRestObj(copy);

								$scope.myForm.submitSuccessCb = function(res) {
									$rootScope.apiData.report = res.data;
									$state.go('app.report', { id: res.data._id, edit: undefined });
								};

								$scope.myForm.submitErrorCb = function(res) {
									$rootScope.apiData.report = copy;
								};

								// Making request
								return copy.put();
							},
							onCancel: function() {

								window.history.back();
							}
						});

						break;
				}
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