var appFrameConf = function() {
  return {
    ctrlId: 'appFrame',
    switchers: [
      { _id: 'start', use: true },
      { _id: 'main', use: true }
    ]
  };
};

appFrameConf.$inject = [];
angular.module('appModule').service('appFrameConf', appFrameConf);