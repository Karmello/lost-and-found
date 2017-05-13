(function() {

	'use strict';

	var MainController = function($scope, reportsConf) {

		$scope.searchCollectionBrowser = reportsConf.searchCollectionBrowser;
		$scope.profileCollectionBrowser = reportsConf.profileCollectionBrowser;
	};

	MainController.$inject = ['$scope', 'reportsConf'];
	angular.module('appModule').controller('MainController', MainController);

})();