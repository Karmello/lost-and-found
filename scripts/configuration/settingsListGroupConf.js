(function() {

	'use strict';

	var settingsListGroupConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'settingsListGroup',
			switchers: [
				{
					_id: 'application',
					label: hardData.sections[7],
					onActivate: function() {
						$rootScope.globalFormModels.appConfigModel.set();
					}
				},
				{
					_id: 'account',
					label: hardData.sections[8],
					onActivate: function() {
						$rootScope.globalFormModels.personalDetailsModel.set();
						$rootScope.globalFormModels.passwordModel.clear();
					}
				},
				{
					_id: 'danger',
					label: hardData.sections[24],
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