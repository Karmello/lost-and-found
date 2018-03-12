angular.module('appModule').directive('myBtn', function($rootScope, MyBtn) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'public/templates/myBtn.html',
    scope: {
      btnClass: '<',
      iconClass: '<',
      hardData: '<',
      onClick: '&',
      state: '=',
      showModalId: '@'
    },
    controller: function($scope) {
      
      $scope.ins = new MyBtn($scope);
      $scope.onMouseEnter = function() { $scope.ins.set(1); };
      $scope.onMouseLeave = function() { $scope.ins.set(0); };
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        scope.$watch('state', function(btnState) {
          scope.ins.set(scope.activeMouseState || 0, Number(btnState) || 0);
        });

        scope.$watch('label_0_0', function(label) {
          scope.ins.set(scope.activeMouseState || 0);
        });

        if (scope.showModalId) {
          scope.onClick = function() { $rootScope.$broadcast(scope.showModalId); };
        }
      };
    }
  };
});