var mainFrameNavConf = function($rootScope, hardDataService) {

  var hardData = hardDataService.get();

  var config = {
    ctrlId: 'mainFrameNav',
    icon: 'glyphicon glyphicon-option-horizontal',
    switchers: [
      { _id: 'settings' },
      { _id: 'separator' },
      { _id: 'about' },
      { _id: 'help' },
      { _id: 'contact' },
      { _id: 'separator' },
      {
        _id: 'logout',
        route: '/#/start/login',
        label: hardData.imperatives[12],
        icon: 'glyphicon glyphicon-off',
        onClick: function() { $rootScope.logout(); }
      }
    ]
  };

  return config;
};

mainFrameNavConf.$inject = ['$rootScope', 'hardDataService'];
angular.module('appModule').service('mainFrameNavConf', mainFrameNavConf);