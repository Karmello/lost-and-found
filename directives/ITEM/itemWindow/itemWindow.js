(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemWindow', function($rootScope, $timeout, $state, myClass, Restangular, ItemsRest) {

		var actionMethodName;

		var itemWindow = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemWindow/itemWindow.html',
			scope: true,
			controller: function($scope) {

				$scope.itemCategories = $rootScope.apiData.itemCategories;

				$scope.myModal = new myClass.MyModal({ id: 'itemModal', title: $rootScope.hardData.phrases[62] });
				$scope.myModel = new myClass.MyFormModel('itemModel', ['_id', 'userId', 'typeId', 'categoryId', 'subcategoryId', 'title', 'description'], true);
				$scope.myForm = new myClass.MyForm({ ctrlId: 'itemForm', model: $scope.myModel });



				$scope.addItem = function(args) {

					// Setting model userId value
					$scope.myModel.setValue('userId', $rootScope.globalFormModels.personalDetailsModel.getValue('_id'));

					$scope.myForm.submitSuccessCb = function(res) {
						$scope.myModal.hide(function() {
							$rootScope.$broadcast('initUserItems', { userId: $scope.myModel.getValue('userId') });
						});
					};

					// Making http request
					return ItemsRest.post($scope.myModel.getValues());
				};

				$scope.editItem = function(args) {

					// Making copy of active item
					var copy = Restangular.copy($rootScope.apiData.item);

					// Updating model values
					$scope.myModel.setRestObj(copy);

					$scope.myForm.submitSuccessCb = function(res) {

						$scope.myModal.hide(function() {

							$rootScope.apiData.item = undefined;

							$timeout(function() {

								$rootScope.apiData.item = res.data;

								if ($state.current.name == 'main.profile') {
									$rootScope.$broadcast('initUserItems', { userId: $rootScope.apiData.item.userId });
								}
							}, 300);
						});
					};

					$scope.myForm.submitErrorCb = function(res) {

						$rootScope.apiData.item = copy;
					};

					// Making request
					return copy.put();
				};

				$scope.myForm.submitAction = function(args) {

					return $scope[actionMethodName](args);
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$on('displayAddItemWindow', function(e, args) {

						actionMethodName = 'addItem';
						scope.myForm.showResetBtn = false;

						scope.myModel.set({});
						scope.myModel.clearErrors();
						scope.myModal.show();
					});

					scope.$on('displayEditItemWindow', function(e, args) {

						var item;
						if (args && args.item) { $rootScope.apiData.item = args.item; }

						actionMethodName = 'editItem';
						scope.topText = '';
						scope.myForm.showResetBtn = true;

						scope.myModel.set($rootScope.apiData.item);
						scope.myModel.clearErrors();
						scope.myModal.show();
					});
				};
			}
		};

		return itemWindow;
	});

})();