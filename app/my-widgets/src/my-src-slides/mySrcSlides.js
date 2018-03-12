angular.module('appModule').directive('mySrcSlides', function(MySwitchable) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/mySrcSlides.html',
    scope: {
      mySrcCollection: '=',
      srcType: '@'
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        scope.$watchCollection('mySrcCollection.collection', function(collection) {

          if (collection) {

            var switchers = [];

            for (var i in collection) {
              switchers.push({ _id: collection[i].index, index: collection[i].index });
            }

            scope.mySwitchable = new MySwitchable({ switchers: switchers });
            scope.mySrcCollection.switchable = scope.mySwitchable;
          }
        });
      };
    }
  };
});