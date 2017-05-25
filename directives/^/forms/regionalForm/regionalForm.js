(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('regionalForm', function($rootScope, AppConfigsRest, MyForm, Restangular, UsersRest) {

		var regionalForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/regionalForm/regionalForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = AppConfigsRest.appConfigModel;

				$scope.myForm = new MyForm({
					ctrlId: 'regionalForm',
					model: formModel,
					reload: true,
					submitAction: function(args) {

						formModel.setValue('userId', UsersRest.personalDetailsModel.getValue('_id'));
						var restCopy = Restangular.copy($rootScope.apiData.loggedInUser.appConfig);
						formModel.setRestObj(restCopy);
						return restCopy.put();
					}
				});
			}
		};

		return regionalForm;
	});

})();