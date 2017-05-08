(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.item', {
			url: '/item/:tab?id',
			resolve: {
				_apiData: function(itemCategories, $stateParams, $rootScope, $q) {

					return $q(function(resolve) {

						if ($rootScope.apiData.item && $rootScope.apiData.item._id != $stateParams.id) {
							$rootScope.apiData.item = undefined;
							$rootScope.apiData.itemUser = undefined;
						}

						resolve();
					});
				},
				_ui: function(_apiData, $stateParams, $q, ui) {

					return $q(function(resolve) {
						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('item');
						ui.tabs.item.activateSwitcher($stateParams.tab);
						resolve();
					});
				},
				_item: function(_ui, $stateParams, $q, ItemsRest) {

					return $q(function(resolve) {

						ItemsRest.getList({ _id: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				},
				_user: function(_item, $stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ itemId: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(_item, _user, $rootScope) {

				if (!_item || !_user) { $rootScope.ui.modals.tryAgainLaterModal.show(); }
			}
		});
	});

})();