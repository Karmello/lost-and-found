(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myStateBtn', function($rootScope) {

		var myStateBtn = {
			restrict: 'E',
			templateUrl: 'public/templates/myStateBtn.html',
			scope: {
				type: '@',
				onClick: '&',
				state: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return myStateBtn;
	});

})();