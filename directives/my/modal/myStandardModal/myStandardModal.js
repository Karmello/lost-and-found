(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('myStandardModal', function() {

    var myStandardModal = {
      restrict: 'E',
      templateUrl: 'public/templates/myStandardModal.html',
      scope: {
        ins: '=',
        type: '@'
      }
    };

    return myStandardModal;
  });

})();