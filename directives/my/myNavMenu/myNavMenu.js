(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myNavMenu', function() {

		var myNavMenu = {
			restrict: 'E',
			replace: true,
			templateUrl: 'public/directives/my/myNavMenu/myNavMenu.html',
			scope: {
				ins: '='
			}
		};

		return myNavMenu;
	});

})();