var ui = function(
  appFrameConf, mainFrameConf, topNavMenuConf, settingsListGroupConf, startTabsConf, settingsTabsConf, reportTabsConf, mainFrameNavConf,
  MyLoader, MySwitchable, uiSetupService
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
      app: new MySwitchable(appFrameConf),
      main: new MySwitchable(mainFrameConf)
    },
    menus: {
      top: new MySwitchable(topNavMenuConf)
    },
    listGroups: {
      settings: new MySwitchable(settingsListGroupConf)
    },
    tabs: {
      start: new MySwitchable(startTabsConf),
      application: new MySwitchable(settingsTabsConf.application),
      account: new MySwitchable(settingsTabsConf.account),
      payment: new MySwitchable(settingsTabsConf.payment),
      danger: new MySwitchable(settingsTabsConf.danger),
      report: new MySwitchable(reportTabsConf)
    },
    dropdowns: {
      mainFrameNav: new MySwitchable(mainFrameNavConf),
      settingsCategories: new MySwitchable($.extend(true, { ctrlId: 'settingsCategoriesDropdown', class: 'dropdown' }, settingsListGroupConf))
    },
    loaders: {
      renderer: new MyLoader(undefined, 1)
    }
  };

  uiSetupService.bindGetRouteMethod(ctrls);
  return ctrls;
};

ui.$inject = [
  'appFrameConf', 'mainFrameConf', 'topNavMenuConf', 'settingsListGroupConf', 'startTabsConf', 'settingsTabsConf', 'reportTabsConf',
  'mainFrameNavConf', 'MyLoader', 'MySwitchable', 'uiSetupService'
];

angular.module('appModule').service('ui', ui);