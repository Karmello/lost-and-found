angular.module('appModule').directive('myDirective', function(myDirectiveService) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        myDirectiveService.bindHardCodedData(scope);
        myDirectiveService.evaluateObjectsIntoStrings(scope);
        myDirectiveService.provideInstanceMembers(scope);
      };
    }
  };
});