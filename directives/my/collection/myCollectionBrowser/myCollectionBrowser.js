(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('myCollectionBrowser', function($rootScope) {

    var myCollectionBrowser = {
      restrict: 'E',
      transclude: {
        frontctrls: '?frontctrls',
        endctrls: '?endctrls',
        extractrls: '?extractrls',
        elems: '?elems',
      },
      templateUrl: 'public/templates/myCollectionBrowser.html',
      scope: {
        ins: '=',
        noScrollTopBtn: '='
      },
      controller: function($scope) {

        $scope.hardData = $rootScope.hardData;
      }
    };

    return myCollectionBrowser;
  });

})();