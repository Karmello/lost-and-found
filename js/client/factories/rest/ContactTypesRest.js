(function() {

	'use strict';

	var ContactTypesRest = function(Restangular, MyDataModel) {

		var contactTypes = Restangular.service('contact_types');

		contactTypes.contactTypeModel = new MyDataModel({
			contactType: {},
			contactMsg: {}
		});

		return contactTypes;
	};

	ContactTypesRest.$inject = ['Restangular', 'MyDataModel'];
	angular.module('appModule').factory('ContactTypesRest', ContactTypesRest);

})();