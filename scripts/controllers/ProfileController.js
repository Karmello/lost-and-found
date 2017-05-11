(function() {

	'use strict';

	var ProfileController = function($rootScope, $scope, contextMenuConf, MySwitchable) {

		$scope.profileItemsContextMenu = new MySwitchable(contextMenuConf.profileItemsContextMenu);
	};

	ProfileController.$inject = ['$rootScope', '$scope', 'contextMenuConf', 'MySwitchable'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();