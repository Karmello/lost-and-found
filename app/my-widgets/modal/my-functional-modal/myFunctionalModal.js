angular.module('appModule').directive('myFunctionalModal', function($rootScope, MyModal) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myFunctionalModal.html',
    scope: {
      type: '@'
    },
    compile: function(elem, attrs) {
      return function(scope, elem, attrs) {

        var id = scope.type + 'Modal';
        var showEventName = id + 'Show';

        // If event hasn't been registered yet
        if (!$rootScope.$$listeners[showEventName]) {
          
          scope.ins = new MyModal({ id: id });

          // Subscribing
          $rootScope.$on(showEventName, function(e, args) {
            if (args) { args.id = id; } else { args = { id: id }; }
            scope.ins = new MyModal(args);
            scope.ins.show(args);
          });
          
          // Unsubscribing
          scope.$on('$destroy', function () {
            delete $rootScope.$$listeners[showEventName];
          });
        }
      };
    }
  };
});