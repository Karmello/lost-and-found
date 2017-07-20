(function() {

	'use strict';

	var SettingsController = function($scope, ui) {

		$scope.$watch('ui.listGroups.settings.activeSwitcherId', function(newValue) {
			if (angular.isDefined(newValue)) { $scope.activeTabs = ui.tabs[newValue]; }
		});
	};

	SettingsController.$inject = ['$scope', 'ui'];
	angular.module('appModule').controller('SettingsController', SettingsController);

})();