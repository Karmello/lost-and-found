(function() {

	'use strict';

	var MyFormModel = function($timeout) {

		var MyFormModelValue = function(value, error, errorType) {

			this.value = value;
			this.error = error;
			this.errorType = errorType;
		};

		var MyFormModel = function(_id, keys, allowUseDefaults, onSetCallback) {

			this._id = _id;
			this.keys = keys;
			this.values = {};

			this.defaults = undefined;
			this.allowUseDefaults = allowUseDefaults;
			this.onSetCallback = onSetCallback;

			this.clear();
		};

		MyFormModel.prototype = {
			set: function(freshValues) {

				var that = this;

				// Setting with fresh values
				if (typeof freshValues == 'object') {

					if (that.allowUseDefaults && Object.keys(freshValues).length > 0) { that.defaults = freshValues; }

					if (_.isEmpty(freshValues)) {

						angular.forEach(that.keys, function(key) {
							that.values[key].value = null;
						});

					} else {

						angular.forEach(that.keys, function(key) {

							if (angular.isDefined(freshValues[key])) {
								that.values[key].value = freshValues[key];

							} else {
								that.values[key].value = null;
							}
						});
					}

				// Setting with defaults
				} else {

					if (this.allowUseDefaults && that.defaults) {

						angular.forEach(that.keys, function(key) {

							if (angular.isDefined(that.defaults[key])) {
								that.values[key].value = that.defaults[key];

							} else {
								that.values[key].value = null;
							}
						});
					}
				}
			},
			setValue: function(key, value) {

				this.values[key].value = value;
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
			trimValues: function(formId, callback) {

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

				if (callback) { callback(); }
			},
			getValues: function() {

				var that = this;
				var values = {};

				angular.forEach(that.keys, function(key) {
					values[key] = that.values[key].value;
				});

				return values;
			},
			getValue: function(key) {

				return this.values[key].value;
			},
			bindErrors: function(errors, callback) {

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

					if (callback) { callback(); }

				} else { if (callback) { callback(); } }
			},
			clearErrors: function(callback) {

				var that = this;

				angular.forEach(that.keys, function(key) {

					that.values[key].error = null;
					that.values[key].errorType = null;
				});

				if (callback) { callback(); }
			}
		};

		return MyFormModel;
	};

	MyFormModel.$inject = ['$timeout'];
	angular.module('appModule').factory('MyFormModel', MyFormModel);

})();