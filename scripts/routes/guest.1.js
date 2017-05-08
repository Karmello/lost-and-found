(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('guest.1', {
			url: '/guest/:tab?action',
			resolve: {
				tab: function(countries, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var availableParams = ui.tabs.guest.switcherIds;

						// Valid tab
						if (availableParams.indexOf($stateParams.tab) > -1) {
							resolve();

						// Invalid tab
						} else {

							$state.go('guest.1', { tab: 'login' }, { location: 'replace' });
						}
	    			});
				},
				authentication: function(tab, $q, $state, $stateParams, authService) {

					return $q(function(resolve) {

						authService.authenticate(function(success) {

							if (success && $stateParams.tab != 'status') {
								$state.go('guest.1', { tab: 'status' }, { location: 'replace' });

							} else {
								resolve();
							}
						});
					});
				}
			},
			onEnter: function($state, $stateParams, $timeout, ui) {

				ui.tabs.guest.activateSwitcher($stateParams.tab);
				ui.frames.main.activateSwitcher();

				$timeout(function() {

					if ($state.params.action == 'deactivation') {

						$timeout(function() {
							ui.modals.deactivationDoneModal.show();
						}, 500);
					}

				}, 2500);
			}
		});
	});

})();