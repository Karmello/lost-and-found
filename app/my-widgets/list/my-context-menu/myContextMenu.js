angular.module('appModule').directive('myContextMenu', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myContextMenu.html',
    scope: {
      ins: '='
    }
  };
});