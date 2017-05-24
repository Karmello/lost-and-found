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

						scope.$watch('model.value', function(newValue, oldValue) {

							if (newValue) {
								var geocoder = new google.maps.Geocoder();
								geocoder.geocode({ 'address': newValue }, function(results, status) {
									scope.autocomplete.ins.set('place', results[0]);
								});

							} else {
								scope.autocomplete.label = null;
							}
						});

						scope.autocomplete.init = function() {

							var input = $(elem).find('input').get()[0];

							scope.autocomplete.ins = new google.maps.places.Autocomplete(input);
							scope.autocomplete.label = null;

							scope.autocomplete.ins.addListener('place_changed', function() {

								var place = scope.autocomplete.ins.getPlace();

								if (place) {
									scope.autocomplete.label = place.formatted_address;
									scope.$apply();
								}
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