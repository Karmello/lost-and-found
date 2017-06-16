(function() {

	'use strict';

	var userAvatarService = function($rootScope, $q, aws3Service, MySrcAction, Restangular, URLS) {

		var service = {
			loadPhoto: function(scope, force) {

				scope.src.load(service.constructPhotoUrl(scope, true), force, function(success) {

					if (!success) {
						scope.src.load(service.constructPhotoUrl(scope, true), force);
					}
				});
			},
			constructPhotoUrl: function(scope, useThumb) {

				if (scope.user.photos.length === 0) { return scope.src.defaultUrl; }

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + scope.user._id + '/' + scope.user.photos[0].filename;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.user._id + '/' + scope.user.photos[0].filename;
				}
			},
			uploadRequest: function(args) {

				var src = this;

				return $q(function(resolve) {

					aws3Service.getCredentials('user_avatar', { fileTypes: [args.file.type] }).then(function(res1) {

						var formData = MySrcAction.createFormDataObject(res1.data[0].awsFormData, args.file);

						aws3Service.makeRequest(res1.data[0].awsUrl, formData).success(function(res2) {

							$rootScope.apiData.profileUser.photos[0] = {
								filename: res1.data[0].awsFilename,
								size: args.file.size
							};

							$rootScope.apiData.profileUser.put().then(function(res3) {

								$rootScope.apiData.loggedInUser = Restangular.copy($rootScope.apiData.profileUser);

								resolve({
									success: true,
									url: service.constructPhotoUrl({
										src: src,
										user: $rootScope.apiData.profileUser
									}, true)
								});

							}, function(res3) {
								resolve({ success: false });
							});

						}).error(function(res2) {
							resolve({ success: false });
						});

					}, function(res1) {
						resolve({ success: false });
					});
				});
			},
			removeRequest: function() {

				return $q(function(resolve) {

					$rootScope.apiData.profileUser.photos = [];

					$rootScope.apiData.profileUser.put().then(function() {

						$rootScope.apiData.loggedInUser = Restangular.copy($rootScope.apiData.profileUser);
						resolve(true);

					}, function() {
						resolve(false);
					});
				});
			}
		};

		return service;
	};

	userAvatarService.$inject = ['$rootScope', '$q', 'aws3Service', 'MySrcAction', 'Restangular', 'URLS'];
	angular.module('appModule').service('userAvatarService', userAvatarService);

})();