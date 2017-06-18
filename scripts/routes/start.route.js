(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.start', {
			url: '/start/:tab?action',
			resolve: {
				tab: function(authentication, $q, $state, $stateParams, $timeout, authService, ui) {

					return $q(function(resolve, reject) {

						// Valid tab
						if (ui.tabs.start.switcherIds.indexOf($stateParams.tab) > -1) {

							if (authService.state.authenticated && $stateParams.tab != 'status') {
								reject('status');

							} else if (!authService.state.authenticated && $stateParams.tab == 'status') {
								reject('login');

							} else {
								resolve();
							}

						// Invalid tab
						} else { reject('login'); }

	    			}).then(undefined, function(redirectTab) {

	    				// Reject
	    				$timeout(function() {
							$state.go('app.start', { tab: redirectTab }, { location: 'replace' });
						});
	    			});
				}
			},
			onEnter: function($rootScope, $stateParams, $timeout, ui) {

				ui.tabs.start.activateSwitcher($stateParams.tab);
				ui.frames.main.activateSwitcher();
				ui.frames.app.activateSwitcher('start');
				ui.listGroups.settings.getFirstSwitcher().activate();

				angular.forEach(ui.listGroups.settings.switchers, function(switcher) {
					ui.tabs[switcher._id].getFirstSwitcher().activate();
				});

				ui.loaders.renderer.stop();

				switch ($stateParams.action) {

					case 'deactivation':

						$timeout(function() { ui.modals.deactivationDoneModal.show(); }, 5000);
						break;

					case 'pass_reset':

						if ($stateParams.tab == 'login') {
							$timeout(function() { $rootScope.ui.modals.passResetDoneModal.show(); }, 5000);
						}

						break;
				}
			}
		});
	});

})();