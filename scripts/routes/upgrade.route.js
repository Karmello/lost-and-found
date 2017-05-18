(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.upgrade', {
			url: '/upgrade?id',
			resolve: {
				id: function(authentication, $q, $rootScope, $state, $stateParams, authService) {

					return $q(function(resolve) {

						if (!$stateParams.id) {

							if (authService.state.authenticated) {
								$state.go('app.upgrade', { id: $rootScope.apiData.loggedInUser._id }, { location: 'replace' });

							} else {
								$state.go('app.start', { tab: 'status' }, { location: 'replace' });
							}

						} else { resolve(); }
					});
				},
				getPayment: function(id, $q, $state, $stateParams, PaymentsRest, ui) {

					return $q(function(resolve, reject) {

						PaymentsRest.getList({ userId: $stateParams.id }).then(function(res) {
							resolve(true);

						}, function(res) {

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
				ui.frames.main.activateSwitcher('upgrade');
				ui.frames.app.activateSwitcher('main');
			}
		});
	});

})();