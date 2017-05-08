(function() {

	'use strict';

	var fileService = function(myClass, jsonService) {

		var countries = new myClass.MyFile('public/json/countries.json', function(cb) {

			jsonService.sort.objectsByProperty(countries.data, 'name', true, function(sorted) {
				jsonService.group.sortedObjectsByPropFirstLetter(sorted, 'name', function(grouped) {

					countries.data = grouped;
					cb();
				});
			});
		});

		return {
			countries: countries
		};
	};



	fileService.$inject = ['myClass', 'jsonService'];
	angular.module('appModule').service('fileService', fileService);

})();