(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTabs', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/templates/myTabs.html',
			scope: {
				ins: '='
			}
		};
	});

})();