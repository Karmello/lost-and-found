(function() {

	'use strict';

	var startTabsConf = function($rootScope) {

		var config = {
			_ctrlId: 'startTabs',
			switchers: [
				{
					_id: 'login',
					route: '/#/start/login',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'register',
					route: '/#/start/register',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'recover',
					route: '/#/start/recover',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				},
				{
					_id: 'status',
					route: '/#/start/status',
					onActivate: function() { $rootScope.globalFormModels.userModel.clearErrors(); }
				}
			],
			hardData: { switchers_label: ['phrases', [47, 48, 21, 49]], switchers_info: ['sentences', [4, 5, 6, 7]] }
		};

		return config;
	};

	var settingsTabsConf = function($rootScope, hardDataService) {

		var hardData = hardDataService.get();

		var tabs = {
			application: {
				_ctrlId: 'appTabs',
				switchers: [
					{
						_id: 'appearance',
						route: '/#/settings/application/appearance',
						label: hardData.phrases[73],
						info: hardData.sentences[54],
						onActivate: function() {
							$rootScope.globalFormModels.appConfigModel.set();
						}
					},
					{
						_id: 'regional',
						route: '/#/settings/application/regional',
						label: hardData.phrases[50],
						info: hardData.sentences[8],
						onActivate: function() {
							$rootScope.globalFormModels.appConfigModel.set();
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
						label: hardData.phrases[51],
						info: hardData.sentences[9],
						onActivate: function() {
							$rootScope.globalFormModels.personalDetailsModel.set();
						}
					},
					{
						_id: 'password',
						route: '/#/settings/account/password',
						label: hardData.phrases[52],
						info: hardData.sentences[10],
						onActivate: function() {
							$rootScope.globalFormModels.passwordModel.clear();
						}
					}
				]
			},
			payment: {
				_ctrlId: 'paymentTabs',
				switchers: [
					{
						_id: 'paypal',
						route: '/#/settings/payment/paypal',
						label: hardData.phrases[54],
						info: hardData.sentences[12]
					}
				]
			},
			danger: {
				_ctrlId: 'dangerTabs',
				switchers: [
					{
						_id: 'deactivate',
						route: '/#/settings/danger/deactivate',
						label: hardData.phrases[55],
						info: hardData.sentences[13],
						onActivate: function() {
							$rootScope.globalFormModels.deactivationModel.clear();
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
			hardData: { switchers_label: ['phrases', [70, 58]] }
		};

		return config;
	};



	startTabsConf.$inject = ['$rootScope'];
	settingsTabsConf.$inject = ['$rootScope', 'hardDataService'];
	reportTabsConf.$inject = ['$rootScope'];

	angular.module('appModule').service('startTabsConf', startTabsConf);
	angular.module('appModule').service('settingsTabsConf', settingsTabsConf);
	angular.module('appModule').service('reportTabsConf', reportTabsConf);

})();