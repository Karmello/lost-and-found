(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('registerForm', function($rootScope, $timeout, $state, authService, MyForm, UsersRest) {

		var registerForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/registerForm/registerForm.html',
			scope: true,
			controller: function($scope) {

				$scope.countries = $rootScope.localData.countries;

				$scope.myForm = new MyForm({
					ctrlId: 'registerForm',
					model: UsersRest.registerModel,
					submitAction: function(args) {

						var body = UsersRest.registerModel.getValues();
						return UsersRest.post(body, { action: 'register' }, { captcha_response: args.captchaResponse });
					},
					submitSuccessCb: function(res) {

						UsersRest.registerModel.reset(true, true);

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