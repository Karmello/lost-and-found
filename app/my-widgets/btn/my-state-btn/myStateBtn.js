angular.module('appModule').directive('myStateBtn', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myStateBtn.html',
    scope: {
      type: '@',
      onClick: '&',
      state: '='
    }
  };
});