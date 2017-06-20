(function() {

	'use strict';

	var ui = function(
		appFrameConf, mainFrameConf, topNavMenuConf, settingsListGroupConf, startTabsConf, settingsTabsConf,
		reportTabsConf, mainFrameNavConf, modalsConf, myClass, uiSetupService
	) {

		angular.forEach(mainFrameConf.switchers, function(source) {

			_.assign(_.find(topNavMenuConf.switchers, function(target) {
				return target._id == source._id;
			}), source);

			_.assign(_.find(mainFrameNavConf.switchers, function(target) {
				return target._id == source._id;
			}), source);
		});



		var ctrls = {
			frames: {
				app: new myClass.MySwitchable(appFrameConf),
				main: new myClass.MySwitchable(mainFrameConf)
			},
			menus: {
				top: new myClass.MySwitchable(topNavMenuConf)
			},
			listGroups: {
				settings: new myClass.MySwitchable(settingsListGroupConf)
			},
			tabs: {
				start: new myClass.MySwitchable(startTabsConf),
				application: new myClass.MySwitchable(settingsTabsConf.application),
				account: new myClass.MySwitchable(settingsTabsConf.account),
				payment: new myClass.MySwitchable(settingsTabsConf.payment),
				danger: new myClass.MySwitchable(settingsTabsConf.danger),
				report: new myClass.MySwitchable(reportTabsConf)
			},
			dropdowns: {
				mainFrameNav: new myClass.MySwitchable(mainFrameNavConf),
				settingsCategories: new myClass.MySwitchable($.extend(true, { _ctrlId: 'settingsCategoriesDropdown', class: 'dropdown' }, settingsListGroupConf))
			},
			modals: modalsConf,
			loaders: {
				renderer: new myClass.MyLoader(undefined, 1)
			}
		};



		uiSetupService.bindGetRouteMethod(ctrls);
		return ctrls;
	};

	ui.$inject = [
		'appFrameConf', 'mainFrameConf', 'topNavMenuConf', 'settingsListGroupConf', 'startTabsConf', 'settingsTabsConf',
		'reportTabsConf', 'mainFrameNavConf', 'modalsConf', 'myClass', 'uiSetupService'
	];

	angular.module('appModule').service('ui', ui);

})();