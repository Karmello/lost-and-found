(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $http, $timeout, ReportTypesRest, myClass) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportForm/reportForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = new myClass.MyFormModel('reportModel', ['reportTypeId', 'reportMessage'], false);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'reportForm',
					model: formModel,
					submitAction: function(args) {

						return ReportTypesRest.post(formModel.getValues());
					},
					submitSuccessCb: function(res) {

						formModel.clear();
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return $rootScope.apiData.reportTypes; }, function(newValue) {
						scope.reportTypes = newValue;
					});
				};
			}
		};

		return reportForm;
	});

})();