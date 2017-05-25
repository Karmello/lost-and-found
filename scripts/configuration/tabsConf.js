(function() {

	'use strict';

	var startTabsConf = function(hardDataService, UsersRest) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'startTabs',
			switchers: [
				{
					_id: 'login',
					label: hardData.sections[17],
					info: hardData.description[0],
					route: '/#/start/login',
					onActivate: function() { UsersRest.userModel.clearErrors(); }
				},
				{
					_id: 'register',
					label: hardData.sections[18],
					info: hardData.description[1],
					route: '/#/start/register',
					onActivate: function() { UsersRest.userModel.clearErrors(); }
				},
				{
					_id: 'recover',
					label: hardData.labels[4],
					info: hardData.description[2],
					route: '/#/start/recover',
					onActivate: function() { UsersRest.userModel.clearErrors(); }
				},
				{
					_id: 'status',
					label: hardData.sections[23],
					info: hardData.information[8],
					route: '/#/start/status',
					onActivate: function() { UsersRest.userModel.clearErrors(); }
				}
			]
		};

		return config;
	};

	var settingsTabsConf = function(hardDataService, AppConfigsRest, UsersRest, DeactivationReasonsRest) {

		var hardData = hardDataService.get();

		var tabs = {
			application: {
				_ctrlId: 'appTabs',
				switchers: [
					{
						_id: 'appearance',
						route: '/#/settings/application/appearance',
						label: hardData.sections[10],
						info: hardData.imperatives[34],
						onActivate: function() {
							AppConfigsRest.appConfigModel.set();
						}
					},
					{
						_id: 'regional',
						route: '/#/settings/application/regional',
						label: hardData.sections[9],
						info: hardData.description[5],
						onActivate: function() {
							AppConfigsRest.appConfigModel.set();
						}
					}
				]
			},
			account: {
				_ctrlId: 'accountTabs',
				switchers: [
					{
						_id: 'personal-details',
						route: '/#/settings/account/personal-details',
						label: hardData.sections[12],
						info: hardData.description[3],
						onActivate: function() {
							UsersRest.personalDetailsModel.set();
						}
					},
					{
						_id: 'password',
						route: '/#/settings/account/password',
						label: hardData.labels[2],
						info: hardData.description[4],
						onActivate: function() {
							UsersRest.passwordModel.clear();
						}
					}
				]
			},
			danger: {
				_ctrlId: 'dangerTabs',
				switchers: [
					{
						_id: 'deactivate',
						route: '/#/settings/danger/deactivate',
						label: hardData.imperatives[26],
						info: hardData.warnings[4],
						onActivate: function() {
							DeactivationReasonsRest.deactivationReasonModel.clear();
						}
					}
				]
			}
		};

		return tabs;
	};

	var reportTabsConf = function($rootScope) {

		var getRoute = function() {

			if ($rootScope.apiData.report) {
				return '/#/report/' + this._id + '?id=' + $rootScope.apiData.report._id;
			}
		};

		var config = {
			_ctrlId: 'reportTabs',
			switchers: [
				{
					_id: 'photos',
					getRoute: getRoute,
					onActivate: function() {}
				},
				{
					_id: 'comments',
					getRoute: getRoute,
					onActivate: function() {}
				}
			],
			hardData: { switchers_label: ['sections', [5, 6]] }
		};

		return config;
	};



	startTabsConf.$inject = ['hardDataService', 'UsersRest'];
	settingsTabsConf.$inject = ['hardDataService', 'AppConfigsRest', 'UsersRest', 'DeactivationReasonsRest'];
	reportTabsConf.$inject = ['$rootScope'];

	angular.module('appModule').service('startTabsConf', startTabsConf);
	angular.module('appModule').service('settingsTabsConf', settingsTabsConf);
	angular.module('appModule').service('reportTabsConf', reportTabsConf);

})();