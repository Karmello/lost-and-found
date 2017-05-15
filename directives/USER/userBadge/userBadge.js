(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('userBadge', function($rootScope, $state, authService) {

		return {
			restrict: 'E',
			templateUrl: 'public/directives/USER/userBadge/userBadge.html',
			scope: true,
			controller: function($scope) {

				$scope.authState = authService.state;
				$scope.label1 = $rootScope.hardData.phrases[32];

				$scope.onLogoutClick = function() {
					$rootScope.logout();
				};

				$scope.onContinueClick = function() {
					$state.go('app.home');
				};
			}
		};
	});

})();