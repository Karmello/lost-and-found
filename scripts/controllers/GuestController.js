(function() {

	'use strict';

	var GuestController = function($scope, authService) {

		$scope.$watch(function() { return authService.state.loggedIn; }, function(loggedIn) {

			for (var i = 0; i < 3; i++) { $scope.ui.tabs.guest.switchers[i].isVisible = !loggedIn; }
			$scope.ui.tabs.guest.switchers[3].isVisible = loggedIn;
		});
	};

	GuestController.$inject = ['$scope', 'authService'];
	angular.module('appModule').controller('GuestController', GuestController);

})();