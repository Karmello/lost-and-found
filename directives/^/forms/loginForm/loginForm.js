(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('loginForm', function($rootScope, $timeout, $state, authService, MyForm, UsersRest) {

		var loginForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/loginForm/loginForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.userModel;

				$scope.myForm = new MyForm({
					ctrlId: 'loginForm',
					model: formModel,
					submitAction: function(args) {

						var body = {
							username: formModel.getValue('username'),
							password: formModel.getValue('password'),
						};

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