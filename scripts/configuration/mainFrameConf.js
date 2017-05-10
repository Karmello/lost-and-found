(function() {

	'use strict';

	var mainFrameConf = function($rootScope, $q, hardDataService) {

		var hardData = hardDataService.get();

		var config = {
			_ctrlId: 'mainFrame',
			switchers: [
				{
					_id: 'home',
					route: '/#/home',
					label: hardData.phrases[35],
					icon: 'glyphicon glyphicon-home'
				},
				{
					_id: 'search',
					route: '/#/search',
					label: hardData.phrases[83],
					icon: 'glyphicon glyphicon-search'
				},
				{
					_id: 'report',
					route: '/#/report',
					label: hardData.phrases[141],
					icon: 'glyphicon glyphicon-bullhorn'
				},
				{
					_id: 'profile',
					label: hardData.phrases[38],
					icon: 'glyphicon glyphicon-user'
				},
				{
					_id: 'about',
					route: '/#/about',
					label: hardData.phrases[40],
					icon: 'glyphicon glyphicon-info-sign'
				},
				{
					_id: 'help',
					route: '/#/help',
					label: hardData.phrases[41],
					icon: 'glyphicon glyphicon-question-sign'
				},
				{
					_id: 'contact',
					route: '/#/contact',
					label: hardData.phrases[42],
					icon: 'glyphicon glyphicon-envelope'
				},
				{
					_id: 'item',
					label: hardData.phrases[62],
					icon: 'glyphicon glyphicon-shopping-cart'
				},
				{
					_id: 'editem',
					label: hardData.phrases[68],
					icon: 'glyphicon glyphicon-edit'
				},
				{
					_id: 'settings',
					label: hardData.phrases[39],
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



	mainFrameConf.$inject = ['$rootScope', '$q', 'hardDataService'];
	angular.module('appModule').service('mainFrameConf', mainFrameConf);

})();