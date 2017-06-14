(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myPopOverIcon', function() {

		var myPopOverIcon = {
			restrict: 'E',
			transclude: {
				icon: 'span'
			},
			templateUrl: 'public/directives/my/display/myPopOverIcon/myPopOverIcon.html',
			scope: {
				hardData: '='
			}
		};

		return myPopOverIcon;
	});

})();