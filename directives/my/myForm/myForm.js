(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myForm', function(MyLoader) {

		return {
			restrict: 'E',
			transclude: true,
			templateUrl: 'public/directives/my/myForm/myForm.html',
			scope: {
				ins: '=',
				hardData: '='
			},
			controller: function($scope) {

				$scope.ins.scope = $scope;

				$scope.loader = new MyLoader();
				$scope.ins.model.clear();
				$scope.ins.model.set();
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {};
			}
		};
	});

})();