(function() {

	'use strict';

	var urls = {
		AWS3_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploads/',
		AWS3_RESIZED_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploadsresized/'
	};

	var nums = {
		itemMaxPhotos: 15,
		photoMaxSize: 1048576,
		publicItemMinPhotos: 1
	};

	angular.module('appModule').constant('URLS', urls);
	angular.module('appModule').constant('NUMS', nums);

})();