angular.module('appModule').directive('myScrollTopBtn', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myScrollTopBtn.html',
    controller: function($scope) {

      $scope.scroll = function() {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
      };
    }
  };
});