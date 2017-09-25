(function() {

  angular.module('appModule')
    .config(function($urlRouterProvider, $locationProvider, localStorageServiceProvider) {

      $urlRouterProvider.otherwise('/home');
      $locationProvider.html5Mode(false).hashPrefix('');
      localStorageServiceProvider.setPrefix('laf');



      String.prototype.truncate = function (maxLength) {
        var that = this.toString();
        if (that.length > maxLength) { return that.substr(0, maxLength) + ' ...'; } else { return that; }
      };
    });

})();