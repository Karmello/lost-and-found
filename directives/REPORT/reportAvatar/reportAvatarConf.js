(function() {

	'use strict';

	var reportAvatarConf = function() {

		var conf = {
			defaultUrl: 'public/imgs/item.png'
		};

		return conf;
	};



	reportAvatarConf.$inject = [];
	angular.module('appModule').service('reportAvatarConf', reportAvatarConf);

})();