(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myLabel', function() {

		var myLabel = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myLabel/myLabel.html',
			scope: {
				text: '=',
				cssClass: '='
			}
		};

		return myLabel;
	});

})();