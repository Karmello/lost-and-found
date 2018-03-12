var startTabsConf = function(hardDataService) {

  var hardData = hardDataService.get();

  var config = {
    ctrlId: 'startTabs',
    switchers: [
      {
        _id: 'login',
        label: hardData.sections[17],
        info: hardData.description[0],
        route: '/#/start/login'
      },
      {
        _id: 'register',
        label: hardData.sections[18],
        info: hardData.description[1],
        route: '/#/start/register'
      },
      {
        _id: 'recover',
        label: hardData.labels[4],
        info: hardData.description[2],
        route: '/#/start/recover'
      },
      {
        _id: 'status',
        label: hardData.sections[23],
        info: hardData.information[8],
        route: '/#/start/status'
      }
    ]
  };

  return config;
};

startTabsConf.$inject = ['hardDataService'];
angular.module('appModule').service('startTabsConf', startTabsConf);