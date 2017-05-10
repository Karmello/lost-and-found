(function() {

	'use strict';

	var mainFrameNavConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'mainFrameNav',
			icon: 'glyphicon glyphicon-option-horizontal',
			switchers: [
				{ _id: 'settings' },
				{ _id: 'separator' },
				{ _id: 'about' },
				{ _id: 'help' },
				{ _id: 'contact' },
				{ _id: 'separator' },
				{
					_id: 'logout',
					route: '/#/guest/login',
					label: hardData.phrases[12],
					icon: 'glyphicon glyphicon-off',
					onClick: function() { $rootScope.logout(); }
				}
			]
		};

		return config;
	};



	mainFrameNavConf.$inject = ['$rootScope', 'hardDataService'];
	angular.module('appModule').service('mainFrameNavConf', mainFrameNavConf);

})();