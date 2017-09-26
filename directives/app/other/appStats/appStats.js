(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('appStats', function($rootScope) {

    var appStats = {
      restrict: 'E',
      templateUrl: 'public/templates/appStats.html',
      scope: true,
      controller: function($scope) {

        $scope.hardData = $rootScope.hardData;
        $scope.apiData = $rootScope.apiData;
      },
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {

        };
      }
    };

    return appStats;
  });

})();