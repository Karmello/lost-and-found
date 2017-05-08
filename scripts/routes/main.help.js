(function() {

	angular.module('appModule').config(function($stateProvider) {

		$stateProvider.state('main.help', {
			url: '/help',
			onEnter: function(ui) {

				ui.frames.main.activateSwitcher('help');
				ui.menus.top.activateSwitcher('help');
			}
		});
	});

})();