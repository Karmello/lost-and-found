(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('reportSearchForm', function($rootScope, myClass) {

		var reportSearchForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportSearchForm/reportSearchForm.html',
			scope: true,
			controller: function($scope) {

				$scope.reportCategories = $rootScope.hardData.reportCategories;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'reportSearchForm',
					noLoader: true,
					model: $rootScope.globalFormModels.reportSearchModel,
					submitAction: function(args) {

						$rootScope.$broadcast('initSearchReports');
					}
				});
			}
		};

		return reportSearchForm;
	});

})();