(function() {

	'use strict';

	var authService = function($rootScope, $window, storageService, sessionConst, UsersRest) {

		var service = {
			state: {
				authenticated: false,
				loggedIn: false
			},
			authenticate: function(cb) {

				// Token not authenticated yet
				if (!service.state.authenticated) {

					var authToken = storageService.authToken.getValue();

					// Auth token found
					if (authToken) {

						UsersRest.post({ authToken: authToken }).then(function(res) {

							// Successful authentication
							service.setAsLoggedIn(function() {
								cb(true, res);
							});

						}, function(res) {

							// Could not authenticate
							service.setAsLoggedOut(function() {
								cb(false, res);
							});
						});

					// No auth token
					} else {

						service.setAsLoggedOut(function() {
							cb(false);
						});
					}

				// Already authenticated
				} else {

					service.state.loggedIn = true;
					cb(true);
				}
			},
			setAsLoggedIn: function(cb) {

				// Updating state variables
				service.state.authenticated = true;
				service.state.loggedIn = true;

				// Checking if logged in user's appConfig and current session settings defer or not

				var appConfig = $rootScope.apiData.loggedInUser.appConfig;

				if (appConfig.language != sessionConst.language || appConfig.theme != sessionConst.theme) {
					$window.location.reload();

				} else {

					// Setting models values
					$rootScope.globalFormModels.personalDetailsModel.set($rootScope.apiData.loggedInUser);
					$rootScope.globalFormModels.appConfigModel.set($rootScope.apiData.loggedInUser.appConfig);

					if (cb) { cb(); }
				}
			},
			setAsLoggedOut: function(cb) {

				// Updating service state variables
				service.state.authenticated = false;
				service.state.loggedIn = false;

				// Updating other services variables
				storageService.authToken.remove();
				$rootScope.apiData.loggedInUser = undefined;

				if (cb) { cb(); }
			}
		};

		return service;
	};

	authService.$inject = ['$rootScope', '$window', 'storageService', 'sessionConst', 'UsersRest'];
	angular.module('appModule').service('authService', authService);

})();