angular.module('appModule').directive('myNavDropDown', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myNavDropDown.html',
    scope: {
      ins: '='
    }
  };
});