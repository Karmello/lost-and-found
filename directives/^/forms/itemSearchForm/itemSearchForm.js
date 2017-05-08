(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('itemSearchForm', function($rootScope, myClass) {

		var itemSearchForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/itemSearchForm/itemSearchForm.html',
			scope: true,
			controller: function($scope) {

				$scope.itemCategories = $rootScope.apiData.itemCategories;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'itemSearchForm',
					noLoader: true,
					model: $rootScope.globalFormModels.itemSearchModel,
					submitAction: function(args) {

						$rootScope.$broadcast('initSearchItems');
					}
				});
			}
		};

		return itemSearchForm;
	});

})();