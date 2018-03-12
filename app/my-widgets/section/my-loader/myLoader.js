angular.module('appModule').directive('myLoader', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myLoader.html',
    scope: {
      fixedCentered: '=',
      absCentered: '='
    }
  };
});