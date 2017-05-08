(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('recoverForm', function($rootScope, $http, MyForm) {

		var recoverForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/recoverForm/recoverForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = $rootScope.globalFormModels.userModel;

				$scope.myForm = new MyForm({
					ctrlId: 'recoverForm',
					model: formModel,
					submitAction: function(args) {

						return $http.post('/recover', { email: formModel.getValue('email') }, {
							headers: { captcha_response: args.captchaResponse }
						});
					},
					submitSuccessCb: function(res) {

						$rootScope.ui.modals.infoModal.show({
							title: res.data.msg.title,
							message: res.data.msg.info
						});
					}
				});
			}
		};

		return recoverForm;
	});

})();