angular.module('appModule').directive('myTabs', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myTabs.html',
    scope: {
      ins: '='
    }
  };
});