angular.module('appModule').directive('mySrc', function($timeout, MySwitchable) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/mySrc.html',
    scope: {
      ins: '=',
      type: '@',
      isSelectable: '&',
      contextMenuConf: '=',
      hrefTarget: '@',
      noLoader: '<'
    },
    controller: function($scope) {

      if ($scope.isSelectable() || $scope.contextMenuConf) {
        $scope.onMouseEnter = function() { $scope.srcCtrlsVisible = true; };
        $scope.onMouseLeave = function() { $scope.srcCtrlsVisible = false; };
      }

      if ($scope.isSelectable()) { $scope.ins.isSelected = false; }

      if ($scope.contextMenuConf) {
        $scope.contextMenu = new MySwitchable($scope.contextMenuConf);
        $scope.contextMenu.data = $scope.ins;
      }
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        var srcCtrl = $(elem).find(scope.type).get()[0];

        $(srcCtrl).bind('load', function() {
          scope.$apply();
          scope.ins.deferred.resolve(true);
        });

        $(srcCtrl).bind('error', function() {
          scope.$apply();
          scope.ins.deferred.resolve(false);
        });
      };
    }
  };
});