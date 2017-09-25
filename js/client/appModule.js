(function() {

  'use strict';

  var $q = angular.injector(['ng']).get('$q');
  var $http = angular.injector(['ng']).get('$http');

  var appModule = angular.module('appModule', [
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    'restangular',
    'LocalStorageModule',
    'angular-momentjs',
    'ngTextTruncate'
  ]);

  $q.all([

    $http.get('public/json/hardCodedData.json', { cache: true }),
    $http.get('/session')

  ]).then(function(res) {

    appModule.constant('hardDataConst', { en: res[0].data.en, pl: res[0].data.pl });
    appModule.constant('sessionConst', res[1].data);
    angular.element(document).ready(function() { angular.bootstrap(document, ['appModule']); });
  });

})();