(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.user', {
			url: '/user/:tab?id',
			resolve: {
				_apiData: function(itemCategories, $rootScope, $stateParams, $q) {

					return $q(function(resolve) {

						if ($rootScope.apiData.profileUser && $rootScope.apiData.profileUser._id != $stateParams.id) {
							$rootScope.apiData.profileUser = undefined;
						}

						resolve();
					});
				},
				_ui: function(_apiData, $q, $stateParams, ui)	 {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('user');
						ui.tabs.user.activateSwitcher($stateParams.tab);
						resolve();
					});
				},
				_user: function(_ui, $stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ _id: $stateParams.id }).then(function() {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(_user, $rootScope, $stateParams) {

				if (!_user) {
					$rootScope.ui.modals.tryAgainLaterModal.show();

				} else {

					// switch ($stateParams.tab) {

					// 	case 'items':
					// 		$rootScope.$broadcast('initUserItems', { userId: $stateParams.id });
					// 		break;

					// 	case 'subscriptions':
					// 		$rootScope.$broadcast('initUserAuctions', { userId: $stateParams.id });
					// 		break;
					// }
				}
			}
		});
	});

})();