var myStorageConf = function() {
  return {
    authToken: {
      _id: 'auth_token',
      type: 'cookie',
      daysToExpire: 30
    }
  };
};

myStorageConf.$inject = [];
angular.module('appModule').service('myStorageConf', myStorageConf);