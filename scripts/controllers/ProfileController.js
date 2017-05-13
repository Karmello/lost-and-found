(function() {

	'use strict';

	var ProfileController = function($rootScope, $scope, contextMenuConf, MySwitchable) {

		$scope.profileReportsContextMenu = new MySwitchable(contextMenuConf.profileReportsContextMenu);
	};

	ProfileController.$inject = ['$rootScope', '$scope', 'contextMenuConf', 'MySwitchable'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();