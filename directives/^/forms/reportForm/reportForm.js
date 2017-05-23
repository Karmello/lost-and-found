(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportForm', function($rootScope, $state, myClass, reportsService, Restangular) {

		var reportForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/reportForm/reportForm.html',
			scope: {
				action: '@'
			},
			controller: function($scope) {

				$scope.ui = $rootScope.ui;
				$scope.apiData = $rootScope.apiData;
				$scope.hardData = $rootScope.hardData;

				$scope.autocomplete = reportsService.getAutoCompleteObj($scope);

				var date = new Date();
				$scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
				$scope.minDate = new Date(2000, 0, 1);

				$scope.myModel = new myClass.MyFormModel('reportFormModel', reportsService.formModelFields, true, function() {
					if ($scope.autocomplete.init) { $scope.autocomplete.init(); }
				});

				$scope.myModel.set({ date: $scope.maxDate });

				$scope.myForm = new myClass.MyForm({
					ctrlId: $scope.action + 'Form',
					model: $scope.myModel,
					submitAction: reportsService.getFormSubmitAction($scope),
					onCancel: function() { window.history.back(); }
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					switch (scope.action) {

						case 'editReport':

							if (!$rootScope.$$listeners.editReport) {
								$rootScope.$on('editReport', function(e, args) {
									if (args.report) { scope.myModel.setWithRestObj(args.report); }
								});
							}

							scope.$on('$destroy', function() {
								$rootScope.$$listeners.editReport = null;
							});

							break;
					}
				};
			}
		};

		return reportForm;
	});

})();