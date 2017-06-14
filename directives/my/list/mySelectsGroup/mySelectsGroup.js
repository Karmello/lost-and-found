(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('mySelectsGroup', function(hardDataService) {

		var mySelectsGroup = {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/mySelectsGroup/mySelectsGroup.html',
			transclude: true,
			scope: {
				collection: '=',
				model: '=',
				hardData: '='
			}
		};

		return mySelectsGroup;
	});

})();