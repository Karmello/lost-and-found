(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myScrollTopBtn', function() {

		var myScrollTopBtn = {
			restrict: 'E',
			templateUrl: 'public/directives/myScrollTopBtn.html',
			controller: function($scope) {

				$scope.scroll = function() {
					$('html, body').animate({ scrollTop: 0 }, 'fast');
				};
			}
		};

		return myScrollTopBtn;
	});

})();