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
			$('html, body').animate({ scrollTop: $state.current.scrollY }, 'fast');
		});
	});

})();