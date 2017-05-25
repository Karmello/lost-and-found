(function() {

	'use strict';

	var SettingsController = function($scope, ui, UsersRest, AppConfigsRest) {

		$scope.$watch('ui.listGroups.settings.activeSwitcherId', function(newValue) {

			if (angular.isDefined(newValue)) { $scope.activeTabs = ui.tabs[newValue]; }
		});

		$scope.$watch('apiData.loggedInUser', function(newUser) {

			if (newUser) {
				UsersRest.personalDetailsModel.set(newUser.plain(), true);
				AppConfigsRest.appConfigModel.set(newUser.appConfig, true);
			}
		});
	};

	SettingsController.$inject = ['$scope', 'ui', 'UsersRest', 'AppConfigsRest'];
	angular.module('appModule').controller('SettingsController', SettingsController);

})();