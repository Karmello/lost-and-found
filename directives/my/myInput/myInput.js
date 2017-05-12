(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myInput', function() {

		var myInput = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myInput/myInput.html',
			scope: {
				ctrlId: '=',
				ctrlType: '=',
				ctrlMaxLength: '=',
				ctrlMinValue: '=',
				ctrlMaxValue: '=',
				model: '=',
				hardData: '=',
				hideErrors: '=',
				isRequired: '=',
				autocomplete: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (scope.autocomplete) {

						var input = $(elem).find('input')[0];
						scope.autocomplete.ins = new google.maps.places.Autocomplete(input);

						scope.autocomplete.ins.addListener('place_changed', function() {});
					}
				};
			}
		};

		return myInput;
	});

})();