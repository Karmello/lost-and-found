(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.settings2', {
			url: '/settings/:catId',
			resolve: {
				catId: function($timeout, $q, $state, $stateParams, ui) {

					return $q(function(resolve, reject) {

						var settingsSwitcher = ui.frames.main.getSwitcher('_id', 'settings');

						settingsSwitcher.validateCatId($stateParams, ui).then(function(validCatId) {

							if (validCatId) {
								resolve();

							} else {

								$timeout(function() {
									$state.go('main.settings1', {}, { location: 'replace' });
								});
							}
						});
					});
				},
				redirection: function(catId, $timeout, $state, $stateParams, ui) {

					// Setting subcatId and going to main.setting3 state

					$timeout(function() {
						$state.go('main.settings3', {
							catId: $stateParams.catId,
							subcatId: ui.tabs[$stateParams.catId].activeSwitcherId
						}, { location: 'replace' });
					});
				}
			}
		});
	});

})();