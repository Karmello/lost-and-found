(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.editem', {
			url: '/editem?id',
			resolve: {
				getItem: function(itemCategories, $q, $stateParams, ItemsRest) {

					return $q(function(resolve) {

						ItemsRest.getList({ _id: $stateParams.id }).then(function(res) {
							resolve(res.data[0]);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(getItem, $rootScope, $timeout, ui) {

				var timeout = 0;
				if (ui.loaders.renderer.isLoading) { timeout = 3000; }

				$timeout(function() {

					$rootScope.$broadcast('editItem', { item: getItem });

					ui.menus.top.activateSwitcher();

					if (getItem) {
						ui.frames.main.activateSwitcher('editem');

					} else {
						ui.frames.main.activateSwitcher();
						ui.modals.tryAgainLaterModal.show();
					}

				}, timeout);
			}
		});
	});

})();