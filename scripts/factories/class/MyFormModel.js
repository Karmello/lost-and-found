(function() {

	'use strict';

	var MyFormModel = function($timeout) {

		var MyFormModelValue = function(value, error, errorType) {

			this.value = value;
			this.error = error;
			this.errorType = errorType;
		};

		var MyFormModel = function(_id, keys, allowUseDefaults) {

			this._id = _id;
			this.keys = keys;
			this.allowUseDefaults = allowUseDefaults;

			this.values = {};
			this.defaults = undefined;

			this.clear();
		};

		MyFormModel.prototype = {
			set: function(freshValues) {

				var that = this;
				var tempValues;

				// Setting with fresh values
				if (typeof freshValues == 'object') {

					// Fresh values have values
					if (!_.isEmpty(freshValues)) {

						if (that.allowUseDefaults) { that.defaults = freshValues; }
						tempValues = freshValues;

					// Fresh values are empty
					} else { that.clear(); }

				// Setting with defaults
				} else if (this.allowUseDefaults && that.defaults) {

					tempValues = that.defaults;
				}

				// Setting values
				if (tempValues) {

					angular.forEach(that.keys, function(key) {

						if (angular.isDefined(tempValues[key])) {
							that.values[key].value = tempValues[key];

						} else {
							that.values[key] = new MyFormModelValue(null, null, null);
						}
					});
				}
			},
			setValue: function(key, value) {

				this.values[key] = new MyFormModelValue(value, null, null);
			},
			setWithRestObj: function(restObj) {

				var that = this;
				var freshValues = {};

				angular.forEach(that.keys, function(key) {
					freshValues[key] = restObj[key];
				});

				that.set(freshValues);
			},
			setRestObj: function(restObj, cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {
					restObj[key] = that.values[key].value;
				});

				if (cb) { cb(); }
			},
			clear: function() {

				var that = this;

				angular.forEach(that.keys, function(key) {
					that.values[key] = new MyFormModelValue(null, null, null);
				});
			},
			trimValues: function(formId, cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {

					if (typeof that.values[key].value != 'number') {

						var htmlCtrl = $('#' + formId + ' #' + key);

						if (htmlCtrl.length > 0) {

							var value = $(htmlCtrl).val();

							if (value) {
								var trimmed = value.trim();
								that.values[key].value = trimmed;
								$(htmlCtrl).val(trimmed);

							} else {
								that.values[key].value = null;
							}
						}
					}
				});

				if (cb) { cb(); }
			},
			bindErrors: function(errors, cb) {

				var that = this;

				// When errors defined
				if (angular.isDefined(errors)) {

					// Going through all model keys
					angular.forEach(that.keys, function(key) {

						// When error for particular model field defined
						if (errors[key]) {

							that.values[key].errorType = errors[key].kind;
							that.values[key].error = errors[key].message;

						} else {
							that.values[key].errorType = null;
							that.values[key].error = null;
						}
					});

					if (cb) { cb(); }

				} else { if (cb) { cb(); } }
			},
			clearErrors: function(cb) {

				var that = this;

				angular.forEach(that.keys, function(key) {

					that.values[key].error = null;
					that.values[key].errorType = null;
				});

				if (cb) { cb(); }
			},
			getValue: function(key) {

				return this.values[key].value;
			},
			getValues: function() {

				var that = this;
				var values = {};

				angular.forEach(that.keys, function(key) {
					values[key] = that.values[key].value;
				});

				return values;
			}
		};

		return MyFormModel;
	};

	MyFormModel.$inject = ['$timeout'];
	angular.module('appModule').factory('MyFormModel', MyFormModel);

})();