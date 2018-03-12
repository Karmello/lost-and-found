angular.module('appModule').directive('myModal', function($rootScope, $timeout) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myModal.html',
    transclude: {
      header: '?myModalHeader',
      body: '?myModalBody',
      footer: '?myModalFooter'
    },
    scope: {
      ins: '=',
      slideInFromLeft: '<'
    },
    compile: function(elem, attrs) {
      return function(scope, elem, attrs) {

        var delay = 500;

        // onShow
        $('.modal').on('show.bs.modal', function() {
          $rootScope.isAnyModalOpen = true;
        });

        // onHide
        $('.modal').on('hide.bs.modal', function() {
          $rootScope.isAnyModalOpen = false;
          if (scope.ins.hideCb) { $timeout(function() { scope.ins.hideCb(); }, delay); }
        });
      };
    }
  };
});