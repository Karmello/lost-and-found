(function() {

	'use strict';

	var settingsListGroupConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'settingsListGroup',
			switchers: [
				{
					_id: 'application',
					label: hardData.phrases[43],
					onActivate: function() {
						$rootScope.globalFormModels.appConfigModel.set();
					}
				},
				{
					_id: 'account',
					label: hardData.phrases[44],
					onActivate: function() {
						$rootScope.globalFormModels.personalDetailsModel.set();
						$rootScope.globalFormModels.passwordModel.clear();
					}
				},
				// {
				// 	_id: 'payment',
				// 	label: hardData.phrases[45],
				// },
				{
					_id: 'danger',
					label: hardData.phrases[46],
					onActivate: function() {
						$rootScope.globalFormModels.deactivationModel.clear();
					}
				}
			]
		};

		return config;
	};



	settingsListGroupConf.$inject = ['$rootScope', 'hardDataService'];
	angular.module('appModule').service('settingsListGroupConf', settingsListGroupConf);

})();