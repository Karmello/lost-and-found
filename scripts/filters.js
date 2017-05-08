(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.filter('filterByCategory', function() {

		return function(data, category) {

			if (category) {

				var filteredData = [];

				angular.forEach(data, function(item) {

					if (item.name[0] == category) {
						filteredData.push(item);
					}
				});

				return filteredData;

			} else {
				return data;
			}
		};
	});

})();