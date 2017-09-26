(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('myForm', function(MyLoader) {

    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'public/templates/myForm.html',
      scope: {
        ins: '=',
        hardData: '<'
      },
      controller: function($scope) {

        $scope.ins.scope = $scope;
        $scope.loader = new MyLoader();
      },
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {};
      }
    };
  });

})();