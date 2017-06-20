(function() {

	'use strict';

	var jsonService = function() {

		var get = {
			firstLettersArray: function(items, propName, callback) {

				try {

					var keys = Object.keys(items);
					var firstLetters = [];
					var result = [];

					for (var i = 0; i < keys.length; ++i) {
						firstLetters.push(items[keys[i]][propName][0]);
					}

					$.each(firstLetters, function(i, el){
						if ($.inArray(el, result) === -1) {
							result.push(el);
						}
					});

					callback(result);

				} catch(ex) {
					callback();
				}
			},
			firstElemOf: function(collection) {

				if (Array.isArray(collection)) {
					return collection[0];

				} else {
					return collection[Object.keys(collection)[0]];
				}
			}
		};

		var find = {
			objectByProperty: function(arrayOfObjects, propName, propValue, callback) {

				for (var i = 0; i < arrayOfObjects.length; i++) {

					if (arrayOfObjects[i][propName] == propValue) {
						callback(arrayOfObjects[i]);
					}
				}

				callback(null);
			}
		};

		var sort = {
			objectsByProperty: function(arrayOfObjects, propName, asc, callback) {

				arrayOfObjects.sort(function(a, b) {

					if (a[propName] > b[propName]) {
						return asc ? 1 : -1;

					} else if (a[propName] < b[propName]) {
						return asc ? -1 : 1;

					} else {
						return 0;
					}
				});

				if (callback) { callback(arrayOfObjects); }
			}
		};

		var group = {
			sortedObjectsByPropFirstLetter: function(arrayOfObjects, propName, callback) {

				var grouped = [];
				var currentLetter;

				// For each object in array
				for (var i = 0; i < arrayOfObjects.length; i++) {

					// Getting first letter
					var firstLetter = arrayOfObjects[i][propName][0];

					// When encountered the letter for the first time
					if (firstLetter !== currentLetter) {

						currentLetter = firstLetter;
						grouped.push({ label: currentLetter, children: [] });
					}

					// Inserting current iteration object into its group children array
					grouped[grouped.length - 1].children.push(arrayOfObjects[i]);
				}

				callback(grouped);
			}
		};

		var filter = {
			objectsByProperty: function(arrayOfObjects, condition, cb) {

				var conditionKey = Object.keys(condition)[0];
				var conditionValue = condition[conditionKey];

				var filtered = [];

				angular.forEach(arrayOfObjects, function(obj) {
					if (obj[conditionKey] == conditionValue) { filtered.push(obj); }
				});

				cb(filtered);
			}
		};



		return {
			get: get,
			find: find,
			sort: sort,
			group: group,
			filter: filter
		};
	};



	jsonService.$inject = [];
	angular.module('appModule').service('jsonService', jsonService);

})();