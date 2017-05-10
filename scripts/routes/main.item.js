(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.item', {
			url: '/item/:tab?id',
			resolve: {
				getItem: function(itemCategories, $stateParams, $q, ItemsRest) {

					return $q(function(resolve) {

						ItemsRest.getList({ _id: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				},
				getUser: function(getItem, $stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ itemId: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(getItem, getUser, $timeout, $stateParams, ui) {

				var timeout = 0;
				if (ui.loaders.renderer.isLoading) { timeout = 3000; }

				$timeout(function() {

					ui.menus.top.activateSwitcher();

					if (getItem && getUser) {
						ui.frames.main.activateSwitcher('item');
						ui.tabs.item.activateSwitcher($stateParams.tab);

					} else {
						ui.frames.main.activateSwitcher();
						ui.modals.tryAgainLaterModal.show();
					}

				}, timeout);
			}
		});
	});

})();