(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.settings3', {
			url: '/settings/:catId/:subcatId',
			resolve: {
				params: function($timeout, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var settingsSwitcher = ui.frames.main.getSwitcher('_id', 'settings');

						$q.all([
							settingsSwitcher.validateCatId($stateParams, ui),
							settingsSwitcher.validateSubcatId($stateParams, ui)

						]).then(function(results) {

							if (!results[0]) {

								$timeout(function() {
									$state.go('main.settings1', {}, { location: 'replace' });
								});

							} else if (!results[1]) {

								$timeout(function() {
									$state.go('main.settings2', { catId: $stateParams.catId }, { location: 'replace' });
								});

							} else { resolve(); }
						});
					});
				}
			},
			onEnter: function($stateParams, ui) {

				ui.menus.top.activateSwitcher('settings');

				ui.listGroups.settings.activateSwitcher($stateParams.catId);
				ui.dropdowns.settingsCategories.activateSwitcher($stateParams.catId);
				ui.tabs[$stateParams.catId].activateSwitcher($stateParams.subcatId);

				ui.frames.main.activateSwitcher('settings');
			}
		});
	});

})();