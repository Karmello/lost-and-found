(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('deactivationForm', function($rootScope, $timeout, $filter, ui, DeactivationReasonsRest, myClass) {

		var deactivationForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/deactivationForm/deactivationForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.deactivationModel;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'deactivationForm',
					model: formModel,
					submitAction: function(args, cb) {

						return $rootScope.apiData.loggedInUser.remove(formModel.getValues());
					},
					submitSuccessCb: function(res) {

						$rootScope.logout({ action: 'deactivation' });
					}
				});

				$scope.onDeactivateClick = function() {

					if ($scope.myForm.model.getValue('deactivationReasonId')) {

						$rootScope.ui.modals.confirmDeactivationModal1.show({
							acceptCb: function() {

								$rootScope.ui.modals.confirmDeactivationModal2.show({
									acceptCb: function() {
										$scope.myForm.submit();
									}
								});
							}
						});
					}
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return $rootScope.apiData.deactivationReasons; }, function(newValue) {
						scope.deactivationReasons = newValue;
					});
				};
			}
		};

		return deactivationForm;
	});

})();