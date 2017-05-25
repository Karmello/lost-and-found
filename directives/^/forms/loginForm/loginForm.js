(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('loginForm', function($timeout, $state, authService, MyForm, UsersRest) {

		var loginForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/loginForm/loginForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'loginForm',
					model: UsersRest.loginModel,
					submitAction: function(args) {

						var body = UsersRest.loginModel.getValues();
						return UsersRest.post(body, undefined, { captcha_response: args.captchaResponse });
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

		return loginForm;
	});

})();