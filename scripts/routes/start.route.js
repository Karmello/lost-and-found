(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.start', {
			url: '/start/:tab?action',
			resolve: {
				_tab: function(authentication, $q, $state, $stateParams, $timeout, ui, authService) {

					return $q(function(resolve) {

						// Valid tab
						if (ui.tabs.start.switcherIds.indexOf($stateParams.tab) > -1) {

							if (authService.state.authenticated && $stateParams.tab != 'status') {
								$timeout(function() {
									$state.go('app.start', { tab: 'status' }, { location: 'replace' });
								});

							} else { resolve(); }

						// Invalid tab
						} else {

							$timeout(function() {
								$state.go('app.start', { tab: 'login' }, { location: 'replace' });
							});
						}
	    			});
				}
			},
			onEnter: function($rootScope, $state, $stateParams, $timeout, ui) {

				ui.listGroups.settings.getFirstSwitcher().activate();

				angular.forEach(ui.listGroups.settings.switchers, function(switcher) {
					ui.tabs[switcher._id].getFirstSwitcher().activate();
				});

				ui.tabs.start.activateSwitcher($stateParams.tab);
				ui.frames.main.activateSwitcher();
				ui.frames.app.activateSwitcher('start');



				$timeout(function() {

					switch ($state.params.action) {

						case 'deactivation':

							$timeout(function() { ui.modals.deactivationDoneModal.show(); }, 500);
							break;

						case 'pass_reset':

							if ($state.params.tab == 'login') {
								$timeout(function() { $rootScope.ui.modals.passResetDoneModal.show(); }, 500);
							}

							break;
					}

				}, 2500);
			}
		});
	});

})();