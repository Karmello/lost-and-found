var settingsListGroupConf = function(hardDataService) {

  var hardData = hardDataService.get();

  var config = {
    ctrlId: 'settingsListGroup',
    switchers: [
      {
        _id: 'application',
        label: hardData.sections[7]
      },
      {
        _id: 'account',
        label: hardData.sections[8]
      },
      {
        _id: 'danger',
        label: hardData.sections[24]
      }
    ]
  };

  return config;
};

settingsListGroupConf.$inject = ['hardDataService'];
angular.module('appModule').service('settingsListGroupConf', settingsListGroupConf);