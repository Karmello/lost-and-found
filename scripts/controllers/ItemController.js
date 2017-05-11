(function() {

	'use strict';

	var ItemController = function($rootScope, $scope, itemsService, itemsConf, commentsConf, MySwitchable) {

		$scope.itemsService = itemsService;
		$scope.commentsBrowser = commentsConf.itemCommentsBrowser;

		$scope.$watch(function() { return $rootScope.apiData.item; }, function(item) {

			if (item && item._isOwn()) {
				$scope.itemContextMenu = new MySwitchable(itemsConf.itemContextMenuConf);
				$scope.itemContextMenu.data = item;

			} else {
				$scope.itemContextMenu = null;
			}
		});
	};

	ItemController.$inject = ['$rootScope', '$scope', 'itemsService', 'itemsConf', 'commentsConf', 'MySwitchable'];
	angular.module('appModule').controller('ItemController', ItemController);

})();