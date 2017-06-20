(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('regionalForm', function($rootScope, MyForm, AppConfigsRest, Restangular) {

		var regionalForm = {
			restrict: 'E',
			templateUrl: 'public/templates/regionalForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new MyForm({
					ctrlId: 'regionalForm',
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

		return regionalForm;
	});

})();