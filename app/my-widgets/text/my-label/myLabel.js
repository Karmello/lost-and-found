angular.module('appModule').directive('myLabel', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myLabel.html',
    scope: {
      text: '=',
      cssClass: '='
    }
  };
});