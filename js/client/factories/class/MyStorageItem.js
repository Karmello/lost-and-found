(function() {

	'use strict';

	var MyStorageItem = function(localStorageService) {

		var MyStorageItem = function(config) {

			this._id = config._id;
			this.type = config.type;
			if (angular.isDefined(config.daysToExpire)) { this.daysToExpire = config.daysToExpire; }
		};



		MyStorageItem.prototype.getValue = function() {

			switch (this.type) {

				case 'cookie':
					return localStorageService.cookie.get(this._id);

				case 'localStorageItem':
					return localStorageService.get(this._id);
			}
		};

		MyStorageItem.prototype.setValue = function(newValue) {

			switch (this.type) {

				case 'cookie':
					localStorageService.cookie.set(this._id, newValue, this.daysToExpire);
					break;

				case 'localStorageItem':
					localStorageService.set(this._id, newValue);
					break;
			}
		};

		MyStorageItem.prototype.remove = function() {

			switch (this.type) {

				case 'cookie':
					localStorageService.cookie.remove(this._id);
					break;

				case 'localStorageItem':
					localStorageService.remove(this._id);
					break;
			}
		};



		return MyStorageItem;
	};



	MyStorageItem.$inject = ['localStorageService'];
	angular.module('appModule').factory('MyStorageItem', MyStorageItem);

})();