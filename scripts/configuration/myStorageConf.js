(function() {

	'use strict';

	var myStorageConf = function() {

		var authToken = {
			_id: 'auth_token',
			type: 'cookie',
			daysToExpire: 30
		};



		return {
			authToken: authToken
		};
	};



	myStorageConf.$inject = [];
	angular.module('appModule').service('myStorageConf', myStorageConf);

})();