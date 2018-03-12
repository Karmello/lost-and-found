angular.module('appModule').directive('appStats', function($rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/appStats.html',
    scope: true,
    controller: function($scope) {

      $scope.hardData = $rootScope.hardData;
      $scope.apiData = $rootScope.apiData;
    }
  };
});