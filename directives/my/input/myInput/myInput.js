(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('myInput', function() {

    var myInput = {
      restrict: 'E',
      templateUrl: 'public/templates/myInput.html',
      scope: {
        ctrlId: '=',
        ctrlType: '=',
        ctrlMaxLength: '=',
        ctrlMinValue: '=',
        ctrlMaxValue: '=',
        model: '=',
        hardData: '<',
        hideErrors: '=',
        isDisabled: '='
      },
      controller: function($scope) {},
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {


        };
      }
    };

    return myInput;
  });

})();