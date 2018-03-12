angular.module('appModule').directive('mySelectsGroup', function(hardDataService) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/mySelectsGroup.html',
    transclude: true,
    scope: {
      collection: '=',
      model: '=',
      hardData: '<'
    }
  };
});