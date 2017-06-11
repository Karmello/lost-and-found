(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('reportPhotos', function($rootScope, reportPhotosService, reportPhotosConf, MySrcCollection, MySrcAction, NUMS, URLS) {

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
					getFilesCount: function() { return $rootScope.apiData.report.photos.length; }
				});

				$scope.mainContextMenuConf = reportPhotosConf.getMainContextMenuConf($scope);
				$scope.srcContextMenuConf = reportPhotosConf.getSrcContextMenuConf($scope);

				$scope.srcThumbsCollection = new MySrcCollection({
					defaultUrl: URLS.itemImg,
					uploadRequest: reportPhotosService.makeSingleAws3UploadReq,
					constructUrl: function(i) {

						return reportPhotosService.constructPhotoUrl($scope.report.userId, $scope.report._id, $scope.report.photos[i].filename, true);
					}
				});

				$scope.srcSlidesCollection = new MySrcCollection({
					defaultUrl: URLS.itemImg,
					constructUrl: function(i) {

						return reportPhotosService.constructPhotoUrl($scope.report.userId, $scope.report._id, $scope.report.photos[i].filename, false);
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var firstLoad = true;

					scope.$watch(function() { return scope.report; }, function(report, oldReport) {

						if (oldReport && oldReport._id == report._id && !firstLoad) { return; }

						if (report) {
							scope.srcThumbsCollection.init(scope.report.photos);
							reportPhotosService.initSlidesCollection(scope);
							firstLoad = false;
						}
					});
				};
			}
		};

		return reportPhotos;
	});

})();