(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('passwordForm', function($rootScope, MyForm, UsersRest, Restangular) {

		var passwordForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/passwordForm/passwordForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'passwordForm',
					model: UsersRest.passwordModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						var values = UsersRest.passwordModel.getValues();
						copy.currentPassword = values.currentPassword;
						copy.password = values.password;
						return copy.put();
					},
					submitSuccessCb: function(res) {

						UsersRest.passwordModel.reset(true, true);
					}
				});
			}
		};

		return passwordForm;
	});

})();