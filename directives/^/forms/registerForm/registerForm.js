(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('registerForm', function($rootScope, $timeout, $state, authService, MyForm, UsersRest) {

		var registerForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/registerForm/registerForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				var formModel = $rootScope.globalFormModels.userModel;

				$scope.myForm = new MyForm({
					ctrlId: 'registerForm',
					model: formModel,
					submitAction: function(args) {

						return UsersRest.post(formModel.getValues(), undefined, { captcha_response: args.captchaResponse });
					},
					submitSuccessCb: function(res) {

						authService.setAsLoggedIn(function() {
							$timeout(function() {
								$state.go('app.start', { tab: 'status' });
							});
						});
					},
					submitErrorCb: function(res) {

						authService.setAsLoggedOut();
					}
				});
			}
		};

		return registerForm;
	});

})();