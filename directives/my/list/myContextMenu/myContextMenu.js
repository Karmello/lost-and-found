(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myContextMenu', function() {

		var myContextMenu = {
			restrict: 'E',
			templateUrl: 'public/directives/my/list/myContextMenu/myContextMenu.html',
			scope: {
				ins: '='
			},
			controller: function($scope) {


			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {


				};
			}
		};

		return myContextMenu;
	});

})();