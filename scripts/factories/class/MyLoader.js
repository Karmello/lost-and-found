(function() {

	'use strict';

	var MyLoader = function($timeout) {

		var MyLoader = function(_minLoadTime) {

			if (_minLoadTime) { this.minLoadTime = _minLoadTime; } else { this.minLoadTime = 150; }
			this.isLoading = false;
		};

		MyLoader.prototype.start = function(stopAutomagically, callback) {

			var that = this;
			that.isLoading = true;

			$timeout(function() {
				if (callback) { callback(); }
				if (stopAutomagically) { that.stop(); }
			}, that.minLoadTime);
		};

		MyLoader.prototype.stop = function(callback) {

			this.isLoading = false;
			if (callback) { callback(); }
		};

		return MyLoader;
	};

	MyLoader.$inject = ['$timeout'];
	angular.module('appModule').factory('MyLoader', MyLoader);

})();