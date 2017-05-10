(function() {

	'use strict';

	var ContactTypesRest = function(Restangular, storageService) {

		var contactTypes = Restangular.service('contact_types');
		return contactTypes;
	};

	ContactTypesRest.$inject = ['Restangular', 'storageService'];
	angular.module('appModule').factory('ContactTypesRest', ContactTypesRest);

})();