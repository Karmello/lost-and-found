(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.auction', {
			url: '/auction/:id',
			resolve: {
				_apiData: function(itemCategories, $rootScope, $q) {

					return $q(function(resolve) {
						$rootScope.apiData.auction = undefined;
						resolve();
					});
				},
				_ui: function(_apiData, $q, ui) {

					return $q(function(resolve) {
						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('auction');
						resolve();
					});
				},
				_auction: function(_ui, $stateParams, AuctionsRest) {
					return AuctionsRest.getList({ _id: $stateParams.id });
				},
				_item: function(_auction, $rootScope, ItemsRest) {
					return ItemsRest.getList({ _id: $rootScope.apiData.auction.itemId });
				}
			},
			onEnter: function() {}
		});
	});

})();