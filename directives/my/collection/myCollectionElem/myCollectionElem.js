(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('myCollectionElem', function($rootScope, MySwitchable) {

		var myCollectionElem = {
			restrict: 'E',
			templateUrl: 'public/directives/my/collection/myCollectionElem/myCollectionElem.html',
			transclude: {
				titleSection: '?titleSection',
				avatarSection: '?avatarSection',
				infoSection: '?infoSection',
				bottomSection: '?bottomSection'
			},
			scope: {
				ctrlId: '=',
				data: '=',
				contextMenuConf: '=',
				isSelectable: '='
			},
			controller: function($scope) {

				if ($scope.contextMenuConf) {

					// Creating context menu
					$scope.contextMenu = new MySwitchable($scope.contextMenuConf);
					$scope.contextMenu.data = $scope.data;
				}
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

				};
			}
		};

		return myCollectionElem;
	});

})();