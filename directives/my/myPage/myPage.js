(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myPage', function($rootScope, ui, MySwitchable) {

		var myPage = {
			restrict: 'E',
			templateUrl: 'public/directives/my/myPage/myPage.html',
			transclude: {
				body: '?myPageBody'
			},
			scope: {
				scrollTopBtn: '<',
				isLoading: '=',
				contextMenu: '='
			},
			controller: function($scope) {

				$scope.ui = ui;
			}
		};

		return myPage;
	});

})();