(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('scrollTopBtn', function() {

		var scrollTopBtn = {
			restrict: 'E',
			templateUrl: 'public/directives/^/btns/scrollTopBtn/scrollTopBtn.html',
			controller: function($scope) {

				$scope.scroll = function() {
					$('html, body').animate({ scrollTop: 0 }, 'fast');
				};
			}
		};

		return scrollTopBtn;
	});

})();