(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('passwordForm', function($rootScope, MyForm, Restangular) {

		var passwordForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/passwordForm/passwordForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.passwordModel;

				$scope.myForm = new MyForm({
					ctrlId: 'passwordForm',
					model: formModel,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.loggedInUser);
						copy.currentPassword = formModel.getValue('currentPassword');
						copy.password = formModel.getValue('password');
						return copy.put();
					},
					submitSuccessCb: function(res) {

						formModel.clear();
					}
				});
			}
		};

		return passwordForm;
	});

})();