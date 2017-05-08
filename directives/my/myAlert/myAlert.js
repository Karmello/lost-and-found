(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myAlert', function() {

		var myAlert = {
			restrict: 'E',
			template: '<div class="myAlert alert no_selection" ng-class="ctrlClass" role="alert" ng-bind="message" my-directive></div>',
			scope: {
				ctrlClass: "=",
				hardData: '='
			}
		};

		return myAlert;
	});

})();