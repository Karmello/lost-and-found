angular.module('appModule').directive('myNavMenu', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'public/templates/myNavMenu.html',
    scope: {
      ins: '='
    }
  };
});