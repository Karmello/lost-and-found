angular.module('appModule').directive('myPopOverIcon', function() {
  return {
    restrict: 'E',
    transclude: {
      icon: 'span'
    },
    templateUrl: 'public/templates/myPopOverIcon.html',
    scope: {
      hardData: '<'
    }
  };
});