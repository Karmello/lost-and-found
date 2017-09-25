(function(isNode) {

  'use strict';

  var logService = function($http) {

    var urls = {

      'home': 'http://192.168.43.4:7100',
      'work': '',
      'school': '',
      'current': 'home'
    };

    var options = {
      'allowSendingLogs': true
    };

    var logs = { api: [] };

    var reset = function(routeName) {

      post(routeName, undefined);
    };
    var resetAll = function() {

      var routes = Object.keys(logs);
      for (var i = 0; i < routes.length; ++i) { reset(routes[i]); }
    };
    var post = function(routeName, dataToLog) {

      if (options.allowSendingLogs) {

        var url = urls[urls.current] + '/' + routeName;

        $http({
          url: url,
          method: 'POST',
          data: dataToLog,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    };

    var log = function(printLogs, msg, obj) {

      if (printLogs) {

        if (obj) {
          console.log(msg, obj);

        } else {
          console.log(msg);
        }
      }
    };

    return {
      urls: urls,
      options: options,
      logs: logs,
      reset: reset,
      resetAll: resetAll,
      post: post,
      log: log
    };
  };



  if (!isNode) {
    logService.$inject = ['$http'];
    angular.module('appModule').service('logService', logService);

  } else {
    module.exports = new logService().logs;
  }

})(typeof module !== 'undefined' && module.exports);