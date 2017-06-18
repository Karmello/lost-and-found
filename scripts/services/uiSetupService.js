(function() {

	'use strict';

	var uiSetupService = function($state, $http, $templateCache) {

		var actions = {
			preloadTemplates: function(uiCtrls) {

				var directives = [
					"reports", "appearanceForm", "contactForm", "deactivationForm", "formActionBtns", "loginForm", "passwordForm",
					"personalDetailsForm", "recoverForm", "regionalForm", "registerForm", "reportForm", "reportSearchForm", "upgradeForm",
					"appStats", "userBadge", "reportAvatar", "reportPhotos", "userAvatar", "myBtn", "myScrollTopBtn", "myStateBtn",
					"myCollectionBrowser", "myComments", "myElemSelector", "myLoader", "myPanel", "myPopOverIcon", "myForm",
					"myFormErrorIcon", "myDateInput", "myGooglePlaceAutoComplete", "myInput", "myTextArea", "myContextMenu", "myDropDown",
					"myListGroup", "myNavDropDown", "myNavMenu", "mySelect", "mySelectsGroup", "myTabs", "myImgCropModal", "myModal",
					"myStandardModal", "mySrc", "mySrcSlides", "mySrcThumbs", "myLabel"
				];

				for (var directiveName of directives) {
					$http.get('public/directives/' + directiveName + '.html', { cache: $templateCache });
				}

				for (var frameId of ['app', 'main']) {
					for (var page of uiCtrls.frames[frameId].switchers) {
						$http.get('public/pages/lost-and-found-app-' + page._id + '.html', { cache: $templateCache });
					}
				}
			},
			preloadImgs: function() {

				var filenames = ['avatar.png', 'item.png', 'ok.png', 'paypal.png'];

				for (var filename of filenames) {
					var img = new Image();
					img.src = 'public/imgs/' + filename;
				}
			},
			bindGetRouteMethod: function(uiCtrls) {

				var settingsSwitcher = uiCtrls.frames.main.getSwitcher('_id', 'settings');



				uiCtrls.dropdowns.mainFrameNav.getSwitcher('_id', 'settings').getRoute = function() {
					return settingsSwitcher.getRoute.call(this, uiCtrls);
				};

				angular.forEach(uiCtrls.listGroups.settings.switchers, function(switcher, key) {

					switcher.getRoute = function() {
						return settingsSwitcher.getRoute.call(this, uiCtrls);
					};

					uiCtrls.dropdowns.settingsCategories.switchers[key].getRoute = function() {
						return settingsSwitcher.getRoute.call(this, uiCtrls);
					};
				});
			},
			reInitCtrls: function(uiCtrls) {}
		};

		return actions;
	};



	uiSetupService.$inject = ['$state', '$http', '$templateCache'];
	angular.module('appModule').service('uiSetupService', uiSetupService);

})();