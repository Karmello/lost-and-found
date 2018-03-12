var topNavMenuConf = function() {

  var config = {
    ctrlId: 'topNavMenu',
    switchers: [
      { _id: 'home' },
      { _id: 'search' },
      { _id: 'newreport' }
    ]
  };

  return config;
};

topNavMenuConf.$inject = [];
angular.module('appModule').service('topNavMenuConf', topNavMenuConf);