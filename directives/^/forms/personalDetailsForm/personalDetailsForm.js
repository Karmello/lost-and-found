(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('personalDetailsForm', function($rootScope, fileService, MyForm, Restangular) {

		var personalDetailsForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/personalDetailsForm/personalDetailsForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = fileService.countries;

				$scope.myForm = new MyForm({
					ctrlId: 'personalDetailsForm',
					model: $rootScope.globalFormModels.personalDetailsModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						$scope.myForm.model.setRestObj(copy);
						return copy.put();
					}
				});
			}
		};

		return personalDetailsForm;
	});

})();