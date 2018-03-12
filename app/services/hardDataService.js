var hardDataService = function(hardDataConst, sessionConst) {

  var self = {
    all: hardDataConst,
    get: function() {

      return hardDataConst[sessionConst.language || 'en'];
    }
  };

  return self;
};

hardDataService.$inject = ['hardDataConst', 'sessionConst'];
angular.module('appModule').service('hardDataService', hardDataService);