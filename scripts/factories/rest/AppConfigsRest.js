(function() {

	'use strict';

	var AppConfigsRest = function(Restangular, MyDataModel) {

		var appConfigs = Restangular.service('app_configs');

		appConfigs.appConfigModel = new MyDataModel({
			userId: {},
			language: {},
			theme: {}
		});

		return appConfigs;
	};

	AppConfigsRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('AppConfigsRest', AppConfigsRest);

})();