(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('contactForm', function($rootScope, myClass, ContactTypesRest) {

		var contactForm = {
			restrict: 'E',
			templateUrl: 'public/directives/app/form/contactForm/contactForm.html',
			scope: true,
			controller: function($scope) {

				$scope.myForm = new myClass.MyForm({
					ctrlId: 'contactForm',
					model: ContactTypesRest.contactTypeModel,
					submitAction: function(args) {

						return ContactTypesRest.post(ContactTypesRest.contactTypeModel.getValues());
					},
					submitSuccessCb: function(res) {

						ContactTypesRest.contactTypeModel.reset(true, true);
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