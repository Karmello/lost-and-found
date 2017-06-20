(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('recoverForm', function($rootScope, $http, MyForm, UsersRest) {

		var recoverForm = {
			restrict: 'E',
			templateUrl: 'public/templates/recoverForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'recoverForm',
					model: UsersRest.recoverModel,
					submitAction: function(args) {

						var body = UsersRest.recoverModel.getValues();
						return $http.post('/recover', body, { headers: { captcha_response: args.captchaResponse } });
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