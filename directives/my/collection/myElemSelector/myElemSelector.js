(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myElemSelector', function() {

		var myElemSelector = {
			restrict: 'E',
			templateUrl: 'public/templates/myElemSelector.html',
			scope: {
				isSelected: '='
			},
			controller: function() {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var button = $(elem).find('button').get()[0];

					$(button).on('click', function() {

						scope.isSelected = !scope.isSelected;
						scope.$apply();
					});
				};
			}
		};

		return myElemSelector;
	});

})();