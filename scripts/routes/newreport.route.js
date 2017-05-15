(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('app.newreport', {
			url: '/newreport',
			resolve: {
				_ui: function($q, ui)	 {

					return $q(function(resolve) {

						ui.menus.top.activateSwitcher('newreport');
						ui.frames.main.activateSwitcher('newreport');
						ui.frames.app.activateSwitcher('main');

						resolve();
					});
				}
			},
			onEnter: function() {}
		});
	});

})();