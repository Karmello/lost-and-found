(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myBtn', function($rootScope) {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'public/directives/my/myBtn/myBtn.html',
			scope: {
				ctrlClass: '=',
				clickAction: '=',
				clickArgs: '=',
				clickContext: '=',
				showModalId: '@',
				explicitLabel: '=',
				hardData: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (scope.showModalId) {

						scope.onClick = function() {
							$rootScope.$broadcast(scope.showModalId);
						};

					} else if (typeof scope.clickAction == 'function') {

						scope.onClick = function() {

							if (scope.clickContext) {
								scope.clickAction.call(scope.clickContext, scope.clickArgs);

							} else {
								scope.clickAction(scope.clickArgs);
							}
						};
					}
				};
			}
		};
	});

})();