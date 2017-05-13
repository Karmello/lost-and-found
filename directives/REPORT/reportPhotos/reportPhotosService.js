(function() {

	'use strict';

	var reportPhotosService = function($rootScope, $q, aws3Service, MySrcAction, ReportsRest, Restangular, URLS) {

		var self = {
			constructPhotoUrl: function(userId, reportId, filename, useThumb) {

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + userId + '/reports/' + reportId + '/' + filename;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + userId + '/reports/' + reportId + '/' + filename;
				}
			},
			uploadRequest: function(args, i) {

				var src = this;

				return $q(function(resolve) {

					var credentials = args.credentials[i];
					var inputData = args.inputData[i];

					// Creating form data
					var formData = MySrcAction.createFormDataObject(credentials.awsFormData, inputData);

					// Uploading to s3
					aws3Service.makeRequest(credentials.awsUrl, formData).success(function(res) {

						// When whole upload ended successfully

						src.filename = credentials.awsFilename;
						src.size = inputData.size;

						var report = $rootScope.apiData.report;

						resolve({
							success: true,
							url: self.constructPhotoUrl(report.userId, report._id, src.filename, true)
						});

					}).error(function(res) {
						resolve({ success: false });
					});
				});
			},
			update: function(actionId, scope, inputData, src) {

				// Validating input after choose
				scope.srcAction.validate(actionId, inputData).then(function(res) {

					// When action valid
					if (res.success) {

						// Preparing fileTypes array
						var fileTypes = [];

						for (var i in inputData) {
							if (inputData[i] instanceof File) { fileTypes.push(inputData[i].type); }
						}

						// Asking server for upload credentials for all files
						aws3Service.getCredentials('report_photos', { reportId: $rootScope.apiData.report._id, 'fileTypes': fileTypes }).then(function(res) {

							var args = {
								inputData: inputData,
								credentials: res.data,
								src: src
							};

							scope.srcThumbsCollection[actionId](args, function(result) {
								self.afterUpdateSync(scope);
							});
						});

					// When action invalid
					} else { scope.srcAction.displayModalMessage(res.msgId); }
				});
			},
			delete: function(flag, scope, src, cb) {

				var collection;

				switch (flag) {

					case 'single':
						collection = [src];
						break;

					case 'multiple':
						collection = scope.srcThumbsCollection.getSelectedCollection();
						break;
				}

				scope.srcThumbsCollection.removeFromSet({ collection: collection }, function(success, results) {

					if (success) {
						ReportsRest.getList({ _id: $rootScope.apiData.report._id });
					}
				});
			},
			afterUpdateSync: function(scope, cb) {

				var copy = Restangular.copy($rootScope.apiData.report);

				copy.photos = [];

				for (var i in scope.srcThumbsCollection.collection) {
					copy.photos[i] = {
						filename: scope.srcThumbsCollection.collection[i].filename,
						size: scope.srcThumbsCollection.collection[i].size
					};
				}

				copy.put().then(function(res) {
					$rootScope.apiData.report = res.data;
					if (cb) { cb(true); }

				}, function(res) {
					if (cb) { cb(false); }
				});
			}
		};

		return self;
	};

	reportPhotosService.$inject = ['$rootScope', '$q', 'aws3Service', 'MySrcAction', 'ReportsRest', 'Restangular', 'URLS'];
	angular.module('appModule').service('reportPhotosService', reportPhotosService);

})();