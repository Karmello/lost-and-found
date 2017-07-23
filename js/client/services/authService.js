(function() {

	'use strict';

	var authService = function($rootScope, $window, $q, storageService, sessionConst, UsersRest) {

		var service = {
			state: {
				authenticated: false,
				loggedIn: false
			},
			authenticate: function() {

				return $q(function(resolve) {

					// Token not authenticated yet
					if (!service.state.authenticated) {

						var authToken = storageService.authToken.getValue();

						// Auth token found
						if (authToken) {

							UsersRest.post(undefined, { action: 'auth' }, { 'x-access-token': authToken }).then(function(res) {

								// Successful authentication
								service.setAsLoggedIn(function() {
									resolve(true);
								});

							}, function(res) {

								// Could not authenticate
								service.setAsLoggedOut(function() {
									resolve(false);
								});
							});

						// No auth token
						} else {

							service.setAsLoggedOut(function() {
								resolve(false);
							});
						}

					// Already authenticated
					} else {

						service.state.loggedIn = true;
						resolve(true);
					}
				});
			},
			setAsLoggedIn: function(cb) {

				// Updating state variables
				service.state.authenticated = true;
				service.state.loggedIn = true;

				let loggedInUser = $rootScope.apiData.loggedInUser;

				if (loggedInUser.config.language != sessionConst.language || loggedInUser.config.theme != sessionConst.theme) {
					$window.location.reload();

				} else if (cb) {
					cb();
				}
			},
			setAsLoggedOut: function(cb) {

				// Updating service state variables
				service.state.authenticated = false;
				service.state.loggedIn = false;

				// Updating other services variables
				storageService.authToken.remove();
				$rootScope.apiData.loggedInUser = undefined;
				$rootScope.apiData.payment = undefined;

				if (cb) { cb(); }
			}
		};

		return service;
	};

	authService.$inject = ['$rootScope', '$window', '$q', 'storageService', 'sessionConst', 'UsersRest'];
	angular.module('appModule').service('authService', authService);

})();