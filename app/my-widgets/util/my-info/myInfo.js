angular.module('appModule').directive('myInfo', function(myWidgets) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myInfo.html',
    transclude: true,
    compile: function(elem, attrs) {
      return function(scope, elem, attrs) {

        scope.showInfo = myWidgets.showInfo;
      };
    }
  };
});