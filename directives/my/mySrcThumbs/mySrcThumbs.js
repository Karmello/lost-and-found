(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('mySrcThumbs', function($rootScope, MySwitchable, MyModal) {

		var mySrcThumbs = {
			restrict: 'E',
			templateUrl: 'public/directives/my/mySrcThumbs/mySrcThumbs.html',
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

						// Watching thumbs collection srcs
						scope.$watchCollection('srcThumbsCollection.collection', function(collection) {

							if (collection) {

								var onClick = function() {

									if (scope.srcSlidesCollection.switchable) {

										// Changing active slides switchable
										scope.srcSlidesCollection.switchable.switchers[this.index].activate();

										// Displaying modal
										scope.srcSlidesModal.show();
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

								var onActivate = function() {
									scope.srcSlidesModal.title = scope.srcSlidesCollection.collection[this.index].filename;
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