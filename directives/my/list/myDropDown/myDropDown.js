(function() {

  'use strict';

  var appModule = angular.module('appModule');



  appModule.directive('myDropDown', function() {

    return {
      restrict: 'E',
      templateUrl: 'public/templates/myDropDown.html',
      scope: {
        ins: '=',
        openDirection: '=',
        ctrlClass: '='
      }
    };
  });

})();