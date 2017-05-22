(function() {

	'use strict';

	var ProfileController = function($rootScope, $scope, contextMenuConf, reportsConf, MySwitchable) {

		$scope.profileCollectionBrowser = reportsConf.profileCollectionBrowser;
		$scope.profileReportsContextMenu = new MySwitchable(contextMenuConf.profileReportsContextMenu);
	};

	ProfileController.$inject = ['$rootScope', '$scope', 'contextMenuConf', 'reportsConf', 'MySwitchable'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();