angular.module('appModule').directive('myForm', function(MyLoader) {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'public/templates/myForm.html',
    scope: {
      ctrlId: '@',
      ins: '=',
      noLoader: '<',
      redirectOnSuccess: '<',
      hardData: '<'
    },
    compile: function(elem, attrs) {
      return function(scope, elem, attrs) {
        scope.loader = new MyLoader();
      };
    }
  };
});