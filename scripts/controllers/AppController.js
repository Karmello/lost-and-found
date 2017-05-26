(function() {

	'use strict';

	var AppController = function(
		$rootScope, $scope, $window, $state, storageService, authService, hardDataService, ui, uiSetupService, Restangular
	) {

		$rootScope.ui = ui;
		$rootScope.hardData = hardDataService.get();
		$rootScope.Math = window.Math;

		$rootScope.apiData = {
			loggedInUser: undefined,
			appConfig: undefined,
			profileUser: undefined,
			reportUser: undefined,
			report: undefined,
			deactivationReasons: undefined,
			contactTypes: undefined,
			stats: undefined,
			payment: undefined
		};

		$rootScope.localData = {
			countries: { data: undefined }
		};



		$rootScope.logout = function(extraParams, cb) {

			// Resetting ui ctrls
			uiSetupService.reInitCtrls(ui);

			// Resetting form models
			$rootScope.resetRestModels();

			authService.setAsLoggedOut(function() {
				var params = { tab: 'login' };
				if (extraParams) { Object.assign(params, extraParams); }
				$state.go('app.start', params);
				if (cb) { cb(); }
			});
		};

		$rootScope.resetRestModels = function() {

			// to be implemented
		};

		$rootScope.$watch(function() { return storageService.authToken.getValue(); }, function(newValue) {

			Restangular.setDefaultHeaders({ 'x-access-token': newValue });

			// When token is gone but user still logged in then the app will reload
			if (!newValue && authService.state.loggedIn) { $window.location.reload(); }
		});
	};

	AppController.$inject = [
		'$rootScope', '$scope', '$window', '$state', 'storageService', 'authService', 'hardDataService', 'ui', 'uiSetupService',
		'Restangular'
	];

	angular.module('appModule').controller('AppController', AppController);

})();