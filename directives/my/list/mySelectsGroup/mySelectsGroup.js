(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('mySelectsGroup', function(hardDataService) {

		var mySelectsGroup = {
			restrict: 'E',
			templateUrl: 'public/templates/mySelectsGroup.html',
			transclude: true,
			scope: {
				collection: '=',
				model: '=',
				hardData: '<'
			}
		};

		return mySelectsGroup;
	});

})();