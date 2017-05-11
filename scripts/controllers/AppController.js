(function() {

	'use strict';

	var AppController = function(
		$rootScope, $scope, $window, $timeout, $moment, $state, storageService, authService, hardDataService, ui,
		uiSetupService, myClass, Restangular
	) {

		$rootScope.socket = io('http://localhost:8080');

		$rootScope.ui = ui;
		$rootScope.hardData = hardDataService.get();
		$rootScope.Math = window.Math;

		$rootScope.apiData = {
			loggedInUser: undefined,
			profileUser: undefined,
			itemUser: undefined,
			item: undefined,
			itemCategories: undefined,
			deactivationReasons: undefined,
			contactTypes: undefined
		};

		$rootScope.globalFormModels = {
			userModel: new myClass.MyFormModel(
				'userModel',
				['email', 'username', 'password', 'firstname', 'lastname', 'countryFirstLetter', 'country'],
				false
			),
			appConfigModel: new myClass.MyFormModel(
				'appConfigModel',
				['userId', 'language', 'theme'],
				true
			),
			personalDetailsModel: new myClass.MyFormModel(
				'personalDetailsModel',
				['_id', 'email', 'username', 'firstname', 'lastname', 'countryFirstLetter', 'country', 'registration_date'],
				true
			),
			passwordModel: new myClass.MyFormModel(
				'passwordModel',
				['currentPassword', 'password'],
				false
			),
			deactivationModel: new myClass.MyFormModel(
				'deactivationModel',
				['deactivationReasonId'],
				false
			),
			itemSearchModel: new myClass.MyFormModel(
				'itemSearchModel',
				['title', 'categoryId', 'subcategoryId'],
				true
			)
		};



		$rootScope.logout = function(extraParams, cb) {

			// Resetting ui ctrls
			uiSetupService.reInitCtrls(ui);

			// Resetting form models
			$rootScope.resetGlobalFormModels();

			authService.setAsLoggedOut(function() {
				var params = { tab: 'login' };
				if (extraParams) { Object.assign(params, extraParams); }
				$state.go('guest.1', params);
				if (cb) { cb(); }
			});
		};

		$rootScope.resetGlobalFormModels = function() {

			var modelKeys = Object.keys($rootScope.globalFormModels);
			for (var i = 0; i < modelKeys.length; i++) { $rootScope.globalFormModels[modelKeys[i]].set({}); }
		};

		$rootScope.$watch(function() { return storageService.authToken.getValue(); }, function(newValue) {

			Restangular.setDefaultHeaders({ 'x-access-token': newValue });

			// When token is gone but user still logged in then the app will reload
			if (!newValue && authService.state.loggedIn) { $window.location.reload(); }
		});
	};

	AppController.$inject = [
		'$rootScope', '$scope', '$window', '$timeout', '$moment', '$state', 'storageService', 'authService',
		'hardDataService', 'ui', 'uiSetupService', 'myClass', 'Restangular'
	];

	angular.module('appModule').controller('AppController', AppController);

})();