var reportTabsConf = function($rootScope) {

  var getRoute = function() {

    if ($rootScope.apiData.report) {
      return '/#/report/' + this._id + '?id=' + $rootScope.apiData.report._id;
    }
  };

  var config = {
    ctrlId: 'reportTabs',
    switchers: [
      {
        _id: 'photos',
        getRoute: getRoute,
        onActivate: function() {}
      },
      {
        _id: 'comments',
        getRoute: getRoute,
        onActivate: function() {}
      }
    ],
    hardData: { switchers_label: ['sections', [5, 6]] }
  };

  return config;
};

reportTabsConf.$inject = ['$rootScope'];
angular.module('appModule').service('reportTabsConf', reportTabsConf);