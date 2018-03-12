angular.module('appModule').directive('reports', function($rootScope, $moment, reportsService, reportContextMenuConf) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/reports.html',
    scope: {
      ctrlId: '@',
      noAvatar: '=',
      noInfo: '='
    },
    controller: function($scope) {

      $scope.hardData = $rootScope.hardData;
      $scope.apiData = $rootScope.apiData;
      $scope.$moment = $moment;
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        scope.collectionBrowser = reportsService.collectionBrowser[scope.ctrlId];
        scope.elemContextMenuConf = reportContextMenuConf;
      };
    }
  };
});