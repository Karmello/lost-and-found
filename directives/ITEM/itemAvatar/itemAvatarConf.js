(function() {

	'use strict';

	var itemAvatarConf = function() {

		var conf = {
			defaultUrl: 'public/imgs/item.png'
		};

		return conf;
	};



	itemAvatarConf.$inject = [];
	angular.module('appModule').service('itemAvatarConf', itemAvatarConf);

})();