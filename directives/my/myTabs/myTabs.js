(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTabs', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myTabs/myTabs.html',
			scope: {
				ins: '='
			}
		};
	});

})();