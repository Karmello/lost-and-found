(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTabs', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myTabs/myTabs.html',
			scope: {
				ins: '='
			}
		};
	});

})();