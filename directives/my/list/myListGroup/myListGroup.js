(function() {

  'use strict';

  var appModule = angular.module('appModule');



  appModule.directive('myListGroup', function() {

    return {
      restrict: 'E',
      templateUrl: 'public/templates/myListGroup.html',
      scope: {
        ins: '='
      }
    };
  });

})();