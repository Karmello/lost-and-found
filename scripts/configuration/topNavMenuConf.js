(function() {

	'use strict';

	var topNavMenuConf = function() {

		var config = {
			_ctrlId: 'topNavMenu',
			switchers: [
				{ _id: 'home' },
				{ _id: 'search' }
			]
		};

		return config;
	};



	topNavMenuConf.$inject = [];
	angular.module('appModule').service('topNavMenuConf', topNavMenuConf);

})();