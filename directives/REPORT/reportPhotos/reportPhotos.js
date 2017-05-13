(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportPhotos', function($rootScope, reportPhotosService, reportPhotosConf, MySrcCollection, MySrcAction, NUMS) {

		var reportPhotos = {
			restrict: 'E',
			templateUrl: 'public/directives/REPORT/reportPhotos/reportPhotos.html',
			scope: {
				report: '=',
				editable: '&'
			},
			controller: function($scope) {

				$scope.srcAction = new MySrcAction({
					acceptedFiles: 'image/png,image/jpg,image/jpeg',
					maxFiles: NUMS.reportMaxPhotos,
					maxFileSize: NUMS.photoMaxSize,
					getFilesCount: function() {
						return $rootScope.apiData.report.photos.length;
					}
				});

				// Initializing context menus
				$scope.mainContextMenuConf = reportPhotosConf.getMainContextMenuConf($scope);
				$scope.srcContextMenuConf = reportPhotosConf.getSrcContextMenuConf($scope);
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					// Watching current report
					scope.$watch(function() { return scope.report; }, function(report) {

						if (report) {

							// Instantiating

							scope.srcThumbsCollection = new MySrcCollection({
								defaultUrl: reportPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return reportPhotosService.constructPhotoUrl(scope.report.userId, scope.report._id, scope.report.photos[i].filename, true);
								},
								uploadRequest: reportPhotosService.uploadRequest,
								remove: function(indexes) {

									for (var i = indexes.length - 1; i >= 0; i--) {
										scope.report.photos.splice(indexes[i], 1);
									}

									return scope.report.put();
								}
							});

							scope.srcSlidesCollection = new MySrcCollection({
								defaultUrl: reportPhotosConf.defaultUrl,
								constructUrl: function(i) {
									return reportPhotosService.constructPhotoUrl(scope.report.userId, scope.report._id, scope.report.photos[i].filename, false);
								}
							});

							// Initializing

							scope.srcThumbsCollection.init(scope.report.photos);

							scope.srcSlidesCollection.init(scope.report.photos, function() {
								for (var i in scope.srcSlidesCollection.collection) {
									scope.srcSlidesCollection.collection[i].href = scope.srcSlidesCollection.collection[i].url;
								}
							});
						}
					});
				};
			}
		};

		return reportPhotos;
	});

})();