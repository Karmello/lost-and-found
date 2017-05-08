(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.settings1', {
			url: '/settings',
			resolve: {
				redirection: function($q, $timeout, $state, ui) {

					return $q(function() {

						// Setting catId and subcatId and going to main.setting3 state

						var catId = ui.listGroups.settings.activeSwitcherId;

						$timeout(function() {
							$state.go('main.settings3', {
								catId: catId,
								subcatId: ui.tabs[catId].activeSwitcherId
							}, { location: 'replace' });
						});
					});
				}
			}
		});
	});

})();