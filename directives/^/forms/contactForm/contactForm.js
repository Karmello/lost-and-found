(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('contactForm', function($rootScope, $http, $timeout, ContactTypesRest, myClass) {

		var contactForm = {
			restrict: 'E',
			templateUrl: 'public/directives/^/forms/contactForm/contactForm.html',
			scope: true,
			controller: function($scope) {

				var formModel = new myClass.MyFormModel('contactForm', ['contactType', 'contactMsg'], false);

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'contactForm',
					model: formModel,
					submitAction: function(args) {

						return ContactTypesRest.post(formModel.getValues());
					},
					submitSuccessCb: function(res) {

						formModel.clear();
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return $rootScope.apiData.contactTypes; }, function(newValue) {
						scope.contactTypes = newValue;
					});
				};
			}
		};

		return contactForm;
	});

})();