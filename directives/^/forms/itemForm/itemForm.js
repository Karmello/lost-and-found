(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemForm', function($rootScope, $state, $stateParams, $timeout, myClass, ItemsRest, Restangular) {

		var itemForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/itemForm/itemForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.minDate = new Date(2000, 0, 1);
				$scope.maxDate = new Date();
				$scope.autocomplete = {};

				$scope.itemTypes = $rootScope.hardData.itemTypes;
				$scope.itemCategories = $rootScope.apiData.itemCategories;

				$scope.myModel = new myClass.MyFormModel('itemForm', ['userId', 'date', 'placeId', 'typeId', 'categoryId', 'subcategoryId', 'title', 'description'], true);

				var date = new Date();
				date.setHours(12);
				date.setMinutes(0);
				date.setSeconds(0);
				date.setMilliseconds(0);
				$scope.myModel.set({ date: date });

				$scope.myForm = new myClass.MyForm({ ctrlId: 'itemForm', model: $scope.myModel });

				$scope.myForm.submitAction = function(args) {

					switch ($scope.action) {

						case 'report':

							$scope.myModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));

							if (!$scope.myModel.getValue('date')) {
								$scope.myModel.setValue('date', $scope.myModel.defaults.date);
							}

							$scope.myForm.submitSuccessCb = function(res) {

								$scope.myForm.reset();
								$state.go('main.item', { tab: 'photos', id: res.data._id });
							};

							// Making http request
							var modelValues = $scope.myModel.getValues();
							var place = $scope.autocomplete.ins.getPlace();
							if (place) { modelValues.placeId = place.place_id; } else { modelValues.placeId = null; }
							return ItemsRest.post(modelValues);

						case 'edit':

							// Making copy of active item
							var copy = Restangular.copy($rootScope.apiData.item);

							// Updating model values
							$scope.myModel.setRestObj(copy);

							$scope.myForm.submitSuccessCb = function(res) {

								$rootScope.apiData.item = res.data;
								$state.go('main.item', { tab: 'photos', id: res.data._id });
							};

							$scope.myForm.submitErrorCb = function(res) {

								$rootScope.apiData.item = copy;
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

							if (!$rootScope.$$listeners.editItem) {
								$rootScope.$on('editItem', function(e, args) {
									if (args.item) { scope.myModel.set(args.item); }
								});
							}

							break;
					}
				};
			}
		};

		return itemForm;
	});

})();