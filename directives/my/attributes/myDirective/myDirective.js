(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myDirective', function(hardDataService) {

		var myDirective = {
			restrict: 'A',
			controller: function($scope) {

				// Binding hard coded strings
				hardDataService.bind($scope);
			}
		};

		return myDirective;
	});

})();