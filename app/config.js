angular.module('appModule').config(function(
  localStorageServiceProvider,
  $locationProvider,
  $urlRouterProvider
) {

  localStorageServiceProvider.setPrefix('ng-app');
  $locationProvider.html5Mode(false).hashPrefix('');
  $urlRouterProvider.otherwise('/home');



  String.prototype.truncate = function (maxLength) {
    var that = this.toString();
    if (that.length > maxLength) { return that.substr(0, maxLength) + ' ...'; } else { return that; }
  };
});