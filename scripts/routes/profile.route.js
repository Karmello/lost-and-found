(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.profile', {
			url: '/profile?id',
			resolve: {
				getUser: function(authentication, $state, $stateParams, $q, UsersRest, ui) {

					return $q(function(resolve, reject) {

						UsersRest.getList({ _id: $stateParams.id }).then(function(res) {
							resolve(true);

						}, function() {

							reject();

							if (!ui.loaders.renderer.isLoading) {
								ui.modals.tryAgainLaterModal.show();

							} else {
								$state.go('app.start', { tab: 'status' }, { location: 'replace' });
							}
						});
					});
				}
			},
			onEnter: function(ui) {

				ui.menus.top.activateSwitcher();
				ui.frames.main.activateSwitcher('profile');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();