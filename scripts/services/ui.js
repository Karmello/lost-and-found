(function() {

	'use strict';

	var ui = function(
		mainFrameConf, topNavMenuConf, settingsListGroupConf, guestTabsConf, settingsTabsConf, itemTabsConf,
		mainFrameNavConf, modalsConf, myClass, uiSetupService
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
				main: new myClass.MySwitchable(mainFrameConf)
			},
			menus: {
				top: new myClass.MySwitchable(topNavMenuConf)
			},
			listGroups: {
				settings: new myClass.MySwitchable(settingsListGroupConf)
			},
			tabs: {
				guest: new myClass.MySwitchable(guestTabsConf),
				application: new myClass.MySwitchable(settingsTabsConf.application),
				account: new myClass.MySwitchable(settingsTabsConf.account),
				payment: new myClass.MySwitchable(settingsTabsConf.payment),
				danger: new myClass.MySwitchable(settingsTabsConf.danger),
				item: new myClass.MySwitchable(itemTabsConf)
			},
			dropdowns: {
				mainFrameNav: new myClass.MySwitchable(mainFrameNavConf),
				settingsCategories: new myClass.MySwitchable($.extend(true, { _ctrlId: 'settingsCategoriesDropdown', class: 'dropdown' }, settingsListGroupConf))
			},
			modals: modalsConf,
			loaders: {
				renderer: new myClass.MyLoader()
			}
		};



		uiSetupService.bindGetRouteMethod(ctrls);
		return ctrls;
	};

	ui.$inject = [
		'mainFrameConf', 'topNavMenuConf', 'settingsListGroupConf', 'guestTabsConf', 'settingsTabsConf', 'itemTabsConf',
		'mainFrameNavConf', 'modalsConf', 'myClass', 'uiSetupService'
	];

	angular.module('appModule').service('ui', ui);

})();