(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.profile', {
			url: '/profile?id',
			resolve: {
				_ui: function(itemCategories, $q, ui)	 {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher();
						ui.frames.main.activateSwitcher('profile');
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
			onEnter: function(_user, $rootScope) {

				if (!_user) { $rootScope.ui.modals.tryAgainLaterModal.show(); }
			}
		});
	});

})();