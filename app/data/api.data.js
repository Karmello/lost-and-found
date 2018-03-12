var apiData = function() {
  return {
    loggedInUser: undefined,
    profileUser: undefined,
    reportUser: undefined,
    report: undefined,
    deactivationReasons: undefined,
    contactTypes: undefined,
    stats: undefined,
    payment: undefined
  };
};

apiData.$inject = [];
angular.module('appModule').service('apiData', apiData);