(function() {

	'use strict';

	var ItemCategoriesRest = function(Restangular) {
		return Restangular.service('item_categories');
	};

	ItemCategoriesRest.$inject = ['Restangular'];
	angular.module('appModule').factory('ItemCategoriesRest', ItemCategoriesRest);

})();