(function() {

	'use strict';

	var uiSetupService = function($state, $http, $templateCache) {

		var actions = {
			preloadTemplates: function(uiCtrls) {

				var putInCache = function(res, what) {

					var template = $(res);

					for (var elem of template) {
						if (elem.id) {
							$templateCache.put('public/' + what + '/' + elem.id + '.html', elem.outerHTML);
						}
					}
				};

				$http.get('public/pages/all.html').success(function(res) { putInCache(res, 'pages'); });
				$http.get('public/directives/all.html').success(function(res) { putInCache(res, 'directives'); });
			},
			preloadImgs: function() {

				var filenames = ['avatar.png', 'item.png', 'ok.png', 'paypal.png'];

				for (var filename of filenames) {
					var img = new Image();
					img.src = 'public/imgs/' + filename;
				}
			},
			bindGetRouteMethod: function(uiCtrls) {

				var settingsSwitcher = uiCtrls.frames.main.getSwitcher('_id', 'settings');



				uiCtrls.dropdowns.mainFrameNav.getSwitcher('_id', 'settings').getRoute = function() {
					return settingsSwitcher.getRoute.call(this, uiCtrls);
				};

				angular.forEach(uiCtrls.listGroups.settings.switchers, function(switcher, key) {

					switcher.getRoute = function() {
						return settingsSwitcher.getRoute.call(this, uiCtrls);
					};

					uiCtrls.dropdowns.settingsCategories.switchers[key].getRoute = function() {
						return settingsSwitcher.getRoute.call(this, uiCtrls);
					};
				});
			},
			reInitCtrls: function(uiCtrls) {}
		};

		return actions;
	};



	uiSetupService.$inject = ['$state', '$http', '$templateCache'];
	angular.module('appModule').service('uiSetupService', uiSetupService);

})();