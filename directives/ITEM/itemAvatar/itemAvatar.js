(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemAvatar', function(itemAvatarService, itemAvatarConf, MySrc) {

		var itemAvatar = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemAvatar/itemAvatar.html',
			scope: {
				item: '='
			},
			controller: function($scope) {

				$scope.src = new MySrc({ defaultUrl: itemAvatarConf.defaultUrl });
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					scope.$watch(function() { return scope.item; }, function(item) {

						if (item) {
							scope.src.href = '/#/item/photos?id=' + item._id;
							scope.src.load(itemAvatarService.constructPhotoUrl(scope, true));
						}
					});
				};
			}
		};

		return itemAvatar;
	});

})();