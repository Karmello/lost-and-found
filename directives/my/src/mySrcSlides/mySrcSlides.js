(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('mySrcSlides', function(MySwitchable) {

		var mySrcSlides = {
			restrict: 'E',
			templateUrl: 'public/directives/mySrcSlides.html',
			scope: {
				mySrcCollection: '=',
				srcType: '@'
			},
			controller: function($scope) {


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

		return mySrcSlides;
	});

})();