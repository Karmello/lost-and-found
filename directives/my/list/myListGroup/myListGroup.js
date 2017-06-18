(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myListGroup', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/myListGroup.html',
			scope: {
				ins: '='
			}
		};
	});

})();