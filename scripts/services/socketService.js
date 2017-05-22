(function() {

	'use strict';

	var socketService = function($rootScope) {

		var service = this;

		service.init = function() {

			service.socket = io('http://localhost:8080');
			service.socket.on('UpdateAppStats', service.onUpdateAppStats);
		};

		service.onUpdateAppStats = function(data) {

			console.log(data);

			Object.assign($rootScope.apiData.stats, data);
			$rootScope.$apply();
		};

		return service;
	};

	socketService.$inject = ['$rootScope'];
	angular.module('appModule').service('socketService', socketService);

})();