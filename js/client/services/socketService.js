(function() {

	'use strict';

	var socketService = function($rootScope) {

		var service = this;

		service.init = function() {

			service.socket = io('https://localhost:8080', { query: 'userId=' + $rootScope.apiData.loggedInUser._id });
			service.socket.on('UpdateAppStats', service.onUpdateAppStats);

			service.socket.on('newComment', (data) => {
				console.log('newComment', data);
			});
		};

		service.onUpdateAppStats = function(data) {

			Object.assign($rootScope.apiData.stats, data);
			$rootScope.$apply();
		};

		return service;
	};

	socketService.$inject = ['$rootScope'];
	angular.module('appModule').service('socketService', socketService);

})();