(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myNavDropDown', function() {

		var myNavDropDown = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myNavDropDown/myNavDropDown.html',
			scope: {
				ins: '='
			}
		};

		return myNavDropDown;
	});

})();