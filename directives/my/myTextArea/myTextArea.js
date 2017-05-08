(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTextArea', function() {

		var myTextArea = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myTextArea/myTextArea.html',
			scope: {
				ctrlId: '=',
				ctrlMaxLength: '=',
				model: '=',
				hardData: '='
			}
		};

		return myTextArea;
	});

})();