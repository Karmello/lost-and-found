(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('appearanceForm', function($rootScope, MyForm, Restangular, UsersRest, AppConfigsRest) {

		var appearanceForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/appearanceForm/appearanceForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = AppConfigsRest.appConfigModel;

				$scope.myForm = new MyForm({
					ctrlId: 'appearanceForm',
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

		return appearanceForm;
	});

})();