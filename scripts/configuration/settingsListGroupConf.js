(function() {

	'use strict';

	var settingsListGroupConf = function(hardDataService, DeactivationReasonsRest, UsersRest, AppConfigsRest) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'settingsListGroup',
			switchers: [
				{
					_id: 'application',
					label: hardData.sections[7],
					onActivate: function() {
						AppConfigsRest.appConfigModel.set();
					}
				},
				{
					_id: 'account',
					label: hardData.sections[8],
					onActivate: function() {
						UsersRest.personalDetailsModel.set();
						UsersRest.passwordModel.clear();
					}
				},
				{
					_id: 'danger',
					label: hardData.sections[24],
					onActivate: function() {
						DeactivationReasonsRest.deactivationReasonModel.clear();
					}
				}
			]
		};

		return config;
	};



	settingsListGroupConf.$inject = ['hardDataService', 'DeactivationReasonsRest', 'UsersRest', 'AppConfigsRest'];
	angular.module('appModule').service('settingsListGroupConf', settingsListGroupConf);

})();