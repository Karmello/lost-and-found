(function() {

	'use strict';

	var appFrameConf = function() {

		var config = {
			_ctrlId: 'appFrame',
			switchers: [
				{ _id: 'start' },
				{ _id: 'main' }
			]
		};

		return config;
	};

	var mainFrameConf = function($rootScope, $q, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'mainFrame',
			switchers: [
				{
					_id: 'home',
					route: '/#/home',
					label: hardData.sections[0],
					icon: 'glyphicon glyphicon-home'
				},
				{
					_id: 'search',
					route: '/#/search',
					label: hardData.imperatives[17],
					icon: 'glyphicon glyphicon-search'
				},
				{
					_id: 'newreport',
					route: '/#/newreport',
					label: hardData.imperatives[32],
					icon: 'glyphicon glyphicon-bullhorn'
				},
				{
					_id: 'profile',
					icon: 'glyphicon glyphicon-user'
				},
				{
					_id: 'upgrade',
					icon: 'glyphicon glyphicon-star',
					label: hardData.sections[25]
				},
				{
					_id: 'about',
					route: '/#/about',
					label: hardData.sections[2],
					icon: 'glyphicon glyphicon-info-sign'
				},
				{
					_id: 'help',
					route: '/#/help',
					label: hardData.sections[3],
					icon: 'glyphicon glyphicon-question-sign'
				},
				{
					_id: 'contact',
					route: '/#/contact',
					label: hardData.sections[4],
					icon: 'glyphicon glyphicon-envelope'
				},
				{
					_id: 'report',
					icon: 'glyphicon glyphicon-file'
				},
				{
					_id: 'settings',
					label: hardData.sections[1],
					icon: 'glyphicon glyphicon-cog',
					getRoute: function(uiCtrls) {

						var catId, subcatId;

						switch (this.parent._ctrlId) {

							case 'mainFrameNav':
								catId = uiCtrls.listGroups.settings.getActiveSwitcher()._id;
								break;

							case 'settingsListGroup':
							case 'settingsCategoriesDropdown':
								catId = this._id;
								break;
						}

						subcatId = uiCtrls.tabs[catId].getActiveSwitcher()._id;
						return '/#/settings/' + catId + '/' + subcatId;
					},
					validateCatId: function(stateParams, uiCtrls) {

						return $q(function(resolve) {

							if (uiCtrls.listGroups.settings.switcherIds.indexOf(stateParams.catId) > -1) {
								resolve(true);

							} else { resolve(false); }
						});
					},
					validateSubcatId: function(stateParams, uiCtrls) {

						return $q(function(resolve) {

							if (uiCtrls.tabs[stateParams.catId].switcherIds.indexOf(stateParams.subcatId) > -1) {
								resolve(true);

							} else { resolve(false); }
						});
					}
				}
			]
		};

		return config;
	};

	appFrameConf.$inject = [];
	mainFrameConf.$inject = ['$rootScope', '$q', 'hardDataService'];

	angular.module('appModule').service('appFrameConf', appFrameConf);
	angular.module('appModule').service('mainFrameConf', mainFrameConf);

})();