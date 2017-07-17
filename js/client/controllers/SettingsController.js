(function() {

	'use strict';

	var SettingsController = function($scope, ui, UsersRest) {

		$scope.$watch('ui.listGroups.settings.activeSwitcherId', function(newValue) {
			if (angular.isDefined(newValue)) { $scope.activeTabs = ui.tabs[newValue]; }
		});

		$scope.$watch('apiData.loggedInUser', function(newUser) {

			if (newUser) {

				let user = newUser.plain();

				UsersRest.personalDetailsModel.set(user, true);
				UsersRest.personalDetailsModel.setValue('countryFirstLetter', newUser.country[0], true);
				UsersRest.configModel.set(user, true);
			}
		});
	};

	SettingsController.$inject = ['$scope', 'ui', 'UsersRest'];
	angular.module('appModule').controller('SettingsController', SettingsController);

})();