(function() {

	'use strict';

	var aws3Service = function($http, storageService) {

		var self = {
			getCredentials: function(subject, body) {

				body.authToken = storageService.authToken.getValue();
				return $http.post('/get_aws3_upload_credentials', body, {
					headers: {
						subject: subject
					}
				});
			},
			makeRequest: function(url, body) {

				return $http.post(url, body, {
					transformRequest: angular.identity,
					headers: { 'Content-Type': undefined }
				});
			}
		};

		return self;
	};



	aws3Service.$inject = ['$http', 'storageService'];
	angular.module('appModule').service('aws3Service', aws3Service);

})();