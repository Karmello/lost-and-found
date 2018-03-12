var settingsTabsConf = function(hardDataService) {

  var hardData = hardDataService.get();

  var tabs = {
    application: {
      ctrlId: 'appTabs',
      switchers: [
        {
          _id: 'appearance',
          route: '/#/settings/application/appearance',
          label: hardData.sections[10],
          info: hardData.imperatives[34]
        },
        {
          _id: 'regional',
          route: '/#/settings/application/regional',
          label: hardData.sections[9],
          info: hardData.description[5]
        }
      ]
    },
    account: {
      ctrlId: 'accountTabs',
      switchers: [
        {
          _id: 'personal-details',
          route: '/#/settings/account/personal-details',
          label: hardData.sections[12],
          info: hardData.description[3]
        },
        {
          _id: 'password',
          route: '/#/settings/account/password',
          label: hardData.labels[2],
          info: hardData.description[4]
        }
      ]
    },
    danger: {
      ctrlId: 'dangerTabs',
      switchers: [
        {
          _id: 'deactivate',
          route: '/#/settings/danger/deactivate',
          label: hardData.imperatives[26],
          info: hardData.warnings[4]
        }
      ]
    }
  };

  return tabs;
};

settingsTabsConf.$inject = ['hardDataService'];
angular.module('appModule').service('settingsTabsConf', settingsTabsConf);