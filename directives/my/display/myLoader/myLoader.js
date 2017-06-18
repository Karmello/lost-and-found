(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myLoader', function($timeout) {

		var myLoader = {
			restrict: 'E',
			templateUrl: 'public/directives/myLoader.html',
			scope: {
				fixedCentered: '=',
				absCentered: '='
			}
		};

		return myLoader;
	});

})();