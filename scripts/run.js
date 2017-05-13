(function() {

	angular.module('appModule').run(function($rootScope, $location, $timeout, $state, $moment, apiService, logService, ui, uiThemeService, sessionConst) {

		//logService.resetAll();
		apiService.setup();
		uiThemeService.include(sessionConst.theme);
		$moment.locale(sessionConst.language);

		if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }



		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (fromState.name.split('.')[0] != toState.name.split('.')[0]) {
				ui.loaders.renderer.start();
			}

			if (fromState != toState) {
				$('.modal').modal('hide');
				$('.navbar-collapse').collapse('hide');
			}
		});

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

			fromState.scrollY = window.scrollY;

			$timeout(function() {

				var newScrollY;

				switch (toState.name) {

					case 'main.profile':
					case 'main.report':

						if (toState.id == toParams.id) {
							newScrollY = $state.current.scrollY;

						} else {
							newScrollY = 0;
						}

						toState.id = toParams.id;
						break;

					case 'main.search':
						newScrollY = $state.current.scrollY;
						break;

					case 'main.report.tab':
						return;

					default:
						newScrollY = 0;
						break;
				}

				$('html, body').animate({ scrollTop: newScrollY }, 'fast');
			});

			$timeout(function() { ui.loaders.renderer.stop(); }, 3000);
		});
	});

})();