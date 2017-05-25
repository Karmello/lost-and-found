(function() {

	'use strict';

	var MyDataModel = function() {

		var MyDataModelValue = function() {

			this.value = { active: undefined, default: undefined };
			this.error = { kind: undefined, message: undefined };
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
			set: function(data, storeDefault) {

				var goThrough = function(toSetWithObj, toBeSetObj) {

					for (var prop in toSetWithObj) {

						if (toSetWithObj.hasOwnProperty(prop) && toBeSetObj.hasOwnProperty(prop)) {

							if (toBeSetObj[prop] instanceof MyDataModelValue) {
								toBeSetObj[prop].value.active = toSetWithObj[prop];
								if (storeDefault) { toBeSetObj[prop].value.default = toSetWithObj[prop]; }

							} else {
								goThrough(toSetWithObj[prop], toBeSetObj[prop]);
							}
						}
					}
				};

				goThrough(data, this);
			},
			clear: function(onlyErrors) {

				var goThrough = function(obj) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {

								if (!onlyErrors) {
									obj[prop] = new MyDataModelValue();


								} else {
									obj[prop].error.kind = undefined;
									obj[prop].error.message = undefined;
								}

							} else {
								goThrough(obj[prop]);
							}
						}
					}
				};

				goThrough(this);
			},
			setErrors: function(errors, cb) {

				var goThrough = function(obj, toBeSetObj) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop) && toBeSetObj.hasOwnProperty(prop)) {

							if (toBeSetObj[prop] instanceof MyDataModelValue) {
								toBeSetObj[prop].error.kind = obj[prop].kind;
								toBeSetObj[prop].error.message = obj[prop].message;

							} else {
								goThrough(obj[prop], toBeSetObj[prop]);
							}
						}
					}
				};

				goThrough(errors, this);
				if (cb) { cb(); }
			},
			clearErrors: function(cb) {

				this.clear(true);
				if (cb) { cb(); }
			},
			getValues: function() {

				var goThrough = function(obj, myModelValues) {

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {
								myModelValues[prop] = obj[prop].value.active;

							} else {
								goThrough(obj[prop], myModelValues[prop] = {});
							}
						}
					}

					return myModelValues;
				};

				return goThrough(this, {});
			},
			getValue: function(propPath) {

				var props = propPath.split('.');
				var obj = this;

				for (var prop of props) {
					obj = obj[prop];
				}

				return obj.value.active;
			},
			trimValues: function(ctrlId, cb) {

				var goThrough = function(obj, propPath) {

					if (propPath != '') { propPath += '_'; }

					for (var prop in obj) {

						if (obj.hasOwnProperty(prop)) {

							if (obj[prop] instanceof MyDataModelValue) {

								if (typeof obj[prop].value.active != 'number') {

									var htmlCtrl = $('#' + ctrlId + ' #' + propPath + prop);

									if (htmlCtrl.length > 0) {

										var value = $(htmlCtrl).val();

										if (value) {
											var trimmed = value.trim();
											obj[prop].value.active = trimmed;
											$(htmlCtrl).val(trimmed);

										} else {
											obj[prop].value.active = undefined;
										}
									}
								}

							} else {
								goThrough(obj[prop], propPath + prop);
							}
						}
					}
				};

				goThrough(this, '');
				if (cb) { cb(); }
			}
		}

		return MyDataModel;
	};

	MyDataModel.$inject = [];
	angular.module('appModule').factory('MyDataModel', MyDataModel);

})();