(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('mySrcThumbs', function($rootScope, $timeout, MySwitchable, MyModal) {

    var mySrcThumbs = {
      restrict: 'E',
      templateUrl: 'public/templates/mySrcThumbs.html',
      scope: {
        srcThumbsCollection: '=',
        srcSlidesCollection: '=',
        mainContextMenuConf: '=',
        srcContextMenuConf: '=',
        browsingWindowId: '@',
        srcType: '@',
        isSrcSelectable: '&',
      },
      controller: function($scope) {

        // Creating modal instance for slides
        $scope.srcSlidesModal = new MyModal({ id: $scope.browsingWindowId });

        // Initializing main context menu
        if ($scope.mainContextMenuConf) {
          $scope.mainContextMenu = new MySwitchable($scope.mainContextMenuConf);
        }
      },
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {

          // When collection browsing window available
          if (scope.browsingWindowId) {

            var loadSingleSrc = function(index) {

              scope.srcSlidesCollection.collection[index].load(undefined, undefined, function() {
                scope.srcSlidesCollection.collection[index].href = scope.srcSlidesCollection.collection[index].url;
              });
            };

            // Watching thumbs collection srcs
            scope.$watchCollection('srcThumbsCollection.collection', function(collection) {

              if (collection) {

                var onClick = function() {

                  if (scope.srcSlidesCollection.switchable) {

                    var index = this.index;

                    // Changing active slides switchable
                    scope.srcSlidesCollection.switchable.switchers[index].activate({ doNotLoad: true });

                    // Displaying modal
                    scope.srcSlidesModal.show();

                    // Starting loading src
                    $timeout(function() { loadSingleSrc(index); }, 500);
                  }
                };

                // Binding click event to each src
                for (var i in collection) {
                  collection[i].onClick = onClick;
                }
              }
            });

            // Watching slides srcs switchable
            scope.$watch('srcSlidesCollection.switchable', function(switchable) {

              if (switchable) {

                var onActivate = function(args) {

                  var index = this.index;
                  scope.srcSlidesModal.title = scope.srcSlidesCollection.collection[index].filename + ' (' + (index + 1) + '/' + scope.srcSlidesCollection.collection.length + ')';
                  if (!args || !args.doNotLoad) { loadSingleSrc(index); }
                };

                for (var i in switchable.switchers) {
                  switchable.switchers[i].onActivate = onActivate;
                }
              }
            });
          }
        };
      }
    };

    return mySrcThumbs;
  });

})();