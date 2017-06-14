(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myDateInput', function() {

		var myDateInput = {
			restrict: 'E',
			templateUrl: 'public/directives/my/input/myDateInput/myDateInput.html',
			scope: {
				ctrlId: '=',
				ctrlMaxLength: '=',
				ctrlMinValue: '=',
				ctrlMaxValue: '=',
				model: '=',
				hardData: '=',
				hideErrors: '=',
				isRequired: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return myDateInput;
	});

})();