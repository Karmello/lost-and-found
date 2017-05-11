(function() {

	'use strict';

	var MainController = function($scope, itemsConf) {

		$scope.searchCollectionBrowser = itemsConf.searchCollectionBrowser;
		$scope.profileCollectionBrowser = itemsConf.profileCollectionBrowser;
	};

	MainController.$inject = ['$scope', 'itemsConf'];
	angular.module('appModule').controller('MainController', MainController);

})();