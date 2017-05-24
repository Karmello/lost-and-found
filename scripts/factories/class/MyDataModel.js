(function() {

	'use strict';

	var MyDataModel = function() {

		var MyDataModelValue = function() {

			this.value = undefined;
			this.error = { type: undefined, msg: undefined };
		};

		var MyDataModel = function(myModelConf) {

			var goThrough = function(obj) {

				for (var prop in obj) {

					if (!_.isEmpty(obj[prop])) {
						goThrough(obj[prop]);

					} else {
						obj[prop] = new MyDataModelValue();
					}
				}

				return myModelConf;
			};

			Object.assign(this, goThrough(myModelConf));
		};

		MyDataModel.prototype = {
			set: function(data) {

				var goThrough = function(toSetWithObj, toBeSetObj) {

					for (var prop in toSetWithObj) {

						if (toSetWithObj.hasOwnProperty(prop) && toBeSetObj.hasOwnProperty(prop)) {

							if (toBeSetObj[prop] instanceof MyDataModelValue) {
								toBeSetObj[prop].value = toSetWithObj[prop];

							} else {
								goThrough(toSetWithObj[prop], toBeSetObj[prop]);
							}
						}
					}

					return toBeSetObj;
				};

				return goThrough(data, this);
			},
			getValues: function() {

				var goThrough = function(obj, myModelValues) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {
								myModelValues[prop] = obj[prop].value;

							} else {
								goThrough(obj[prop], myModelValues[prop] = {});
							}
						}
					}

					return myModelValues;
				};

				return goThrough(this, {});
			}
		};

		return MyDataModel;
	};

	MyDataModel.$inject = [];
	angular.module('appModule').factory('MyDataModel', MyDataModel);

})();