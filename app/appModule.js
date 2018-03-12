'use strict';

var appModule = angular.module('appModule', [
  'ui.bootstrap',
  'ui.router',
  'ngAnimate',
  'restangular',
  'LocalStorageModule',
  'angular-momentjs',
  'ngTextTruncate'
]);

if (!window.jasmine) {

  var $q = angular.injector(['ng']).get('$q');
  var $http = angular.injector(['ng']).get('$http');

  var req1 = $http.get('/public/json/hardCodedData.json', { cache: true });
  var req2 = $http.get('/session');

  $q.all([req1, req2]).then(function(res) {
    
    appModule.constant('hardDataConst', { en: res[0].data.en, pl: res[0].data.pl });
    appModule.constant('sessionConst', res[1].data);
    
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['appModule']);
    });
  });
}