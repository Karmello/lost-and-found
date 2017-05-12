(function() {

	'use strict';

	var ItemController = function($rootScope, $scope, $timeout, itemsService, googleMapService, contextMenuConf, commentsConf, MySwitchable) {

		$scope.$watch(function() { return $rootScope.apiData.item; }, function(newItem, oldItem) {

			console.log(newItem._id, oldItem._id);

			if (newItem) {

				if (newItem._isOwn()) {
					$scope.itemContextMenu = new MySwitchable(contextMenuConf.itemContextMenuConf);
					$scope.itemContextMenu.data = newItem;
				}

				var timeout = 0;
				if ($rootScope.ui.loaders.renderer.isLoading) { timeout = 3000; }
				$timeout(function() { googleMapService.initItemMap(newItem.placeId); }, timeout);

			} else {
				$scope.itemContextMenu = null;
			}
		});

		$scope.itemsService = itemsService;
		$scope.commentsBrowser = commentsConf.itemCommentsBrowser;
	};

	ItemController.$inject = ['$rootScope', '$scope', '$timeout', 'itemsService', 'googleMapService', 'contextMenuConf', 'commentsConf', 'MySwitchable'];
	angular.module('appModule').controller('ItemController', ItemController);

})();