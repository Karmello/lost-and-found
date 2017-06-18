(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('deactivationForm', function($rootScope, ui, myClass, DeactivationReasonsRest) {

		var deactivationForm = {
			restrict: 'E',
			templateUrl: 'public/directives/deactivationForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'deactivationForm',
					model: DeactivationReasonsRest.deactivationReasonModel,
					submitAction: function(args, cb) {

						return $rootScope.apiData.loggedInUser.remove(DeactivationReasonsRest.deactivationReasonModel.getValues());
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