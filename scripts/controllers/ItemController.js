(function() {

	'use strict';

	var ItemController = function($rootScope, $scope, $timeout, itemsService, contextMenuConf, commentsConf, MySwitchable) {

		$scope.$watch('apiData.item', function(item) {

			if (item && item._isOwn()) {
				$scope.itemContextMenu = new MySwitchable(contextMenuConf.itemContextMenuConf);
				$scope.itemContextMenu.data = item;

			} else {
				$scope.itemContextMenu = null;
			}
		});

		$scope.itemsService = itemsService;
		$scope.commentsBrowser = commentsConf.itemCommentsBrowser;
	};

	ItemController.$inject = ['$rootScope', '$scope', '$timeout', 'itemsService', 'contextMenuConf', 'commentsConf', 'MySwitchable'];
	angular.module('appModule').controller('ItemController', ItemController);

})();