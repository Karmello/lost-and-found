(function() {

	'use strict';

	var ProfileController = function($scope, $moment, contextMenuConf, reportsConf, MySwitchable) {

		$scope.profileCollectionBrowser = reportsConf.profileCollectionBrowser;
		$scope.profileReportsContextMenu = new MySwitchable(contextMenuConf.profileReportsContextMenu);



		$scope.$watch('apiData.profileUser', function(newUser) {

			if (newUser) {
				$scope.userSince = $moment.duration($moment(new Date()).diff($moment(newUser.registration_date))).humanize();
			}
		});
	};

	ProfileController.$inject = ['$scope', '$moment', 'contextMenuConf', 'reportsConf', 'MySwitchable'];
	angular.module('appModule').controller('ProfileController', ProfileController);

})();