(function() {

	angular.module('appModule').run(function(
		$rootScope, $timeout, $state, $moment, apiService, logService, ui, uiThemeService, sessionConst, socketService
	) {

		ui.loaders.renderer.start();
		uiThemeService.include(sessionConst.theme);

		//logService.resetAll();
		socketService.init();
		apiService.setup();

		$moment.locale(sessionConst.language);

		if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }



		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			if (fromState != toState) { $('.modal').modal('hide'); }
		});

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

			fromState.scrollY = window.scrollY;

			$timeout(function() {

				var newScrollY;

				switch (toState.name) {

					case 'app.profile':
					case 'app.report':

						if (toState.id == toParams.id) {
							newScrollY = $state.current.scrollY;

						} else {
							newScrollY = 0;
						}

						toState.id = toParams.id;
						break;

					case 'app.search':
						newScrollY = $state.current.scrollY;
						break;

					case 'app.start':
					case 'app.report.tabs':
						return;

					default:
						newScrollY = 0;
						break;
				}

				$('html, body').animate({ scrollTop: newScrollY }, 'fast');
			});
		});
	});

})();