(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('items', function($rootScope, itemsConf, contextMenuConf, itemsService) {

		var items = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/items/items.html',
			scope: {
				ctrlId: '@'
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;
				$scope.apiData = $rootScope.apiData;

				$scope.initUserItems = function(userId) {

					$scope.collectionBrowser = itemsConf.profileCollectionBrowser;

					if (userId == $rootScope.apiData.loggedInUser._id) {
						$scope.elemContextMenuConf = contextMenuConf.itemContextMenuConf;

					} else {
						$scope.elemContextMenuConf = undefined;
					}

					$scope.collectionBrowser.init();
				};
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (!$rootScope.$$listeners.initSearchItems) {
						$rootScope.$on('initSearchItems', function(e, args) {
							scope.collectionBrowser = itemsConf.searchCollectionBrowser;
							scope.collectionBrowser.init();
						});
					}

					if (!$rootScope.$$listeners.initUserItems) {
						$rootScope.$on('initUserItems', function(e, args) {
							scope.initUserItems(args.userId);
						});
					}



					switch (scope.ctrlId) {

						case 'UserItems':

							scope.$watch('apiData.profileUser._id', function(userId) {
								if (angular.isDefined(userId)) { scope.initUserItems(userId); }
							});

							break;

						case 'SearchItems':

							scope.collectionBrowser = itemsConf.searchCollectionBrowser;
							scope.collectionBrowser.init();
							break;
					}
				};
			}
		};

		return items;
	});

})();