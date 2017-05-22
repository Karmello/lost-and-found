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
				isDisabled: '=',
				autocomplete: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (scope.autocomplete) {

						scope.autocomplete.init = function() {

							var input = $(elem).find('input').get()[0];

							scope.autocomplete.ins = new google.maps.places.Autocomplete(input);
							scope.autocomplete.icon = null;
							scope.autocomplete.label = null;

							scope.autocomplete.ins.addListener('place_changed', function() {
								scope.autocomplete.onPlaceChanged();
							});
						};

						scope.autocomplete.init();
					}
				};
			}
		};

		return myInput;
	});

})();