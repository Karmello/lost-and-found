(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('itemPhotos', function($rootScope, itemPhotosService, itemPhotosConf, MySrcCollection, MySrcAction, NUMS) {

		var itemPhotos = {
			restrict: 'E',
			templateUrl: 'public/directives/ITEM/itemPhotos/itemPhotos.html',
			scope: {
				item: '=',
				editable: '&'
			},
			controller: function($scope) {

				$scope.srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFiles: NUMS.itemMaxPhotos,
					maxFileSize: NUMS.photoMaxSize,
					getFilesCount: function() {
						return $rootScope.apiData.item.photos.length;
					}
				});

				// Initializing context menus
				$scope.mainContextMenuConf = itemPhotosConf.getMainContextMenuConf($scope);
				$scope.srcContextMenuConf = itemPhotosConf.getSrcContextMenuConf($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Watching current item
					scope.$watch(function() { return scope.item; }, function(item) {

						if (item) {

							// Instantiating

							scope.srcThumbsCollection = new MySrcCollection({
								defaultUrl: itemPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return itemPhotosService.constructPhotoUrl(scope.item.userId, scope.item._id, scope.item.photos[i].filename, true);
								},
								uploadRequest: itemPhotosService.uploadRequest,
								remove: function(indexes) {

									for (var i = indexes.length - 1; i >= 0; i--) {
										scope.item.photos.splice(indexes[i], 1);
									}

									return scope.item.put();
								}
							});

							scope.srcSlidesCollection = new MySrcCollection({
								defaultUrl: itemPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return itemPhotosService.constructPhotoUrl(scope.item.userId, scope.item._id, scope.item.photos[i].filename, false);
								}
							});

							// Initializing

							scope.srcThumbsCollection.init(scope.item.photos);

							scope.srcSlidesCollection.init(scope.item.photos, function() {
								for (var i in scope.srcSlidesCollection.collection) {
									scope.srcSlidesCollection.collection[i].href = scope.srcSlidesCollection.collection[i].url;
								}
							});
						}
					});
				};
			}
		};

		return itemPhotos;
	});

})();