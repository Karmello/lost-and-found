(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('appearanceForm', function($rootScope, MyForm, AppConfigsRest, Restangular) {

		var appearanceForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/appearanceForm/appearanceForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'appearanceForm',
					model: AppConfigsRest.appConfigModel,
					reload: true,
					submitAction: function(args) {

						var copy = Restangular.copy($rootScope.apiData.appConfig);
						AppConfigsRest.appConfigModel.assignTo(copy);
						return copy.put();
					}
				});
			}
		};

		return appearanceForm;
	});

})();