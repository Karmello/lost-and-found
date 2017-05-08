(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myFormErrorIcon', function() {

		var myFormErrorIcon = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myFormErrorIcon/myFormErrorIcon.html',
			scope: {
				args: '='
			}
		};

		return myFormErrorIcon;
	});

})();