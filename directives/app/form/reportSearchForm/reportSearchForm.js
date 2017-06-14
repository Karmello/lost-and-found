(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('reportSearchForm', function($rootScope, myClass, ReportsRest) {

		var reportSearchForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/reportSearchForm/reportSearchForm.html',
			scope: true,
			controller: function($scope) {

				$scope.reportCategories = $rootScope.hardData.reportCategories;

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'reportSearchForm',
					noLoader: true,
					model: ReportsRest.reportSearchModel,
					submitAction: function(args) {

						$rootScope.$broadcast('initSearchReports');
					}
				});
			}
		};

		return reportSearchForm;
	});

})();