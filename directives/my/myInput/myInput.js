(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myInput', function() {

		var myInput = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myInput/myInput.html',
			scope: {
				ctrlId: '=',
				ctrlType: '=',
				ctrlMaxLength: '=',
				ctrlMinValue: '=',
				ctrlMaxValue: '=',
				model: '=',
				hardData: '=',
				hideErrors: '='
			}
		};

		return myInput;
	});

})();