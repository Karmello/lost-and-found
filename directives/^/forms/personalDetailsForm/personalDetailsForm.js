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
					},
					submitSuccessCb: function(res) {

						var user = $rootScope.apiData.loggedInUser;
						var updated = res.config.data;

						user.email = updated.email;
						user.firstname = updated.firstname;
						user.lastname = updated.lastname;
						user.country = updated.country;
						user.photos = updated.photos;
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