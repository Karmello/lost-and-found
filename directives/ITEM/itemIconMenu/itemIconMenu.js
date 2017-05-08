(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemIconMenu', function($rootScope, ui) {

		var itemIconMenu = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemIconMenu/itemIconMenu.html',
			scope: {
				item: '='
			},
			controller: function($scope) {

				$scope.personalDetailsModel = $rootScope.globalFormModels.personalDetailsModel;
 				$scope.mainFrame = ui.frames.main;
			}
		};

		return itemIconMenu;
	});

})();