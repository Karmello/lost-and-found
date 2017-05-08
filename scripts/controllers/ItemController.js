(function() {

	'use strict';

	var ItemController = function(
		$rootScope, $scope, itemsService, auctionsService, itemsConf, auctionsConf, commentsConf, MySwitchable
	) {

		$scope.itemsService = itemsService;
		$scope.auctionsBrowser = auctionsConf.itemAuctionsBrowser;
		$scope.commentsBrowser = commentsConf.itemCommentsBrowser;

		$scope.auctionsContextMenu = new MySwitchable({
			_id: 'auctionsContextMenu',
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{
					_id: 'add',
					label: $rootScope.hardData.phrases[16],
					onClick: function() {
						$rootScope.$broadcast('displayAddAuctionWindow');
					}
				},
				{
					_id: 'delete',
					label: $rootScope.hardData.phrases[14],
					onClick: function() {
						auctionsService.deleteAuctions($scope.auctionsBrowser.getSelectedCollection());
					}
				}
			]
		});

		$scope.$watch(function() { return $rootScope.apiData.item; }, function(item) {

			if (item && item._isOwn()) {
				$scope.itemContextMenu = new MySwitchable(itemsConf.itemContextMenuConf);
				$scope.itemContextMenu.data = item;

			} else {
				$scope.itemContextMenu = null;
			}
		});

		$scope.scrollTo = function(target) {

			$('html, body').animate({ scrollTop: $(target).offset().top - 15 }, 'fast');
		};
	};

	ItemController.$inject = [
		'$rootScope', '$scope', 'itemsService', 'auctionsService', 'itemsConf', 'auctionsConf', 'commentsConf',
		'MySwitchable'
	];

	angular.module('appModule').controller('ItemController', ItemController);

})();