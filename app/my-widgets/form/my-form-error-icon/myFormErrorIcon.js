angular.module('appModule').directive('myFormErrorIcon', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myFormErrorIcon.html',
    scope: {
      args: '='
    }
  };
});