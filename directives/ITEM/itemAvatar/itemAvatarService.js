(function() {

	'use strict';

	var itemAvatarService = function(URLS) {

		var service = {
			constructPhotoUrl: function(scope, useThumb) {

				if (!scope.item.avatarFileName) { return scope.src.defaultUrl; }

				if (!useThumb) {
					return URLS.AWS3_UPLOADS_BUCKET_URL + scope.item.userId + '/items/' + scope.item._id + '/' + scope.item.avatarFileName;

				} else {
					return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.item.userId + '/items/' + scope.item._id + '/' + scope.item.avatarFileName;
				}
			}
		};

		return service;
	};

	itemAvatarService.$inject = ['URLS'];
	angular.module('appModule').service('itemAvatarService', itemAvatarService);

})();