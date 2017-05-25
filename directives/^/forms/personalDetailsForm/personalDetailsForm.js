(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('personalDetailsForm', function($rootScope, MyForm, UsersRest, Restangular) {

		var personalDetailsForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/personalDetailsForm/personalDetailsForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				$scope.myForm = new MyForm({
					ctrlId: 'personalDetailsForm',
					model: UsersRest.personalDetailsModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						$scope.myForm.model.assignTo(copy);
						return copy.put();
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {};
			}
		};

		return personalDetailsForm;
	});

})();