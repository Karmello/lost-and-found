(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.profile', {
			url: '/profile?id',
			resolve: {
				getUser: function($stateParams, $q, UsersRest) {

					return $q(function(resolve) {

						UsersRest.getList({ _id: $stateParams.id }).then(function(res) {
							resolve(true);

						}, function() {
							resolve(false);
						});
					});
				}
			},
			onEnter: function(getUser, $rootScope, $timeout, ui) {

				var timeout = 0;
				if (ui.loaders.renderer.isLoading) { timeout = 3000; }

				$timeout(function() {

					ui.menus.top.activateSwitcher();

					if (getUser) {
						ui.frames.main.activateSwitcher('profile');
						ui.frames.app.activateSwitcher('main');

					} else {
						ui.frames.main.activateSwitcher();
						ui.modals.tryAgainLaterModal.show();
					}

				}, timeout);
			}
		});
	});

})();