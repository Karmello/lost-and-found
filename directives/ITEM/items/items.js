(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('items', function($rootScope, itemsConf, itemsService) {

		var items = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/items/items.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;

				$scope.deleteElems = function() {

					itemsService.deleteItems($scope.collectionBrowser.getSelectedCollection());
				};

				$scope.init = function() {

					switch ($scope.ctrlId) {

						case 'UserItems':

							if ($rootScope.apiData.profileUser._id == $rootScope.apiData.loggedInUser._id) {
								$scope.collectionBrowser = itemsConf.ownCollectionBrowser;
								$scope.elemContextMenuConf = itemsConf.itemContextMenuConf;

							} else {
								$scope.collectionBrowser = itemsConf.anotherUsersCollectionBrowser;
							}

							break;

						case 'SearchItems':
							$scope.collectionBrowser = itemsConf.searchCollectionBrowser;
							break;
					}

					$scope.collectionBrowser.init();
				};

				if (!$scope.collectionBrowser) { $scope.init(); }
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners['init' + scope.ctrlId]) {
						$rootScope.$on('init' + scope.ctrlId, function(e, args) {
							scope.init();
						});
					}

					scope.$on('$destroy', function() {
						$rootScope.$$listeners['init' + scope.ctrlId] = null;
					});
				};
			}
		};

		return items;
	});

})();