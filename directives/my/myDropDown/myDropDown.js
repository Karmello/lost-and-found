(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myDropDown', function() {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/my/myDropDown/myDropDown.html',
			scope: {
				ins: '=',
				openDirection: '=',
				ctrlClass: '='
			}
		};
	});

})();