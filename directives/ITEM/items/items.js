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
							scope.collectionBrowser = itemsConf.profileCollectionBrowser;
							scope.elemContextMenuConf = itemsConf.itemContextMenuConf;
							scope.collectionBrowser.init();
						});
					}



					switch (scope.ctrlId) {

						case 'UserItems':

							scope.collectionBrowser = itemsConf.profileCollectionBrowser;
							scope.elemContextMenuConf = itemsConf.itemContextMenuConf;

							scope.$watch('apiData.profileUser._id', function(userId) {
								if (angular.isDefined(userId)) {
									scope.collectionBrowser.init();
								}
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