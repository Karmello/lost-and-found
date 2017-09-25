(function() {

  'use strict';

  var sessionService = function($http) {

    var session = {
      get: function() {

        return $http.get('/session');
      }
    };

    return session;
  };



  sessionService.$inject = ['$http'];
  angular.module('appModule').service('sessionService', sessionService);

})();