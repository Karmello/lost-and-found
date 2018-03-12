angular.module('appModule').directive('myListGroup', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myListGroup.html',
    scope: {
      ins: '='
    }
  };
});