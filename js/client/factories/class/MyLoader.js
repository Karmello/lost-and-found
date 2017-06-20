(function() {

	'use strict';

	var MyLoader = function($timeout) {

		var MyLoader = function(_minLoadTime, _stopTimeOut) {

			if (_minLoadTime) { this.minLoadTime = _minLoadTime; } else { this.minLoadTime = 150; }
			this.stopTimeOut = _stopTimeOut;

			this.isLoading = false;
		};

		MyLoader.prototype.start = function(stopAutomagically, cb) {

			var that = this;
			that.isLoading = true;

			$timeout(function() {
				if (cb) { cb(); }
				if (stopAutomagically) { that.stop(); }
			}, that.minLoadTime);
		};

		MyLoader.prototype.stop = function(cb) {

			var that = this;

			if (that.stopTimeOut) {

				$timeout(function() {
					that.isLoading = false;
					if (cb) { cb(); }
				}, that.stopTimeOut);

			} else {

				that.isLoading = false;
				if (cb) { cb(); }
			}
		};

		return MyLoader;
	};

	MyLoader.$inject = ['$timeout'];
	angular.module('appModule').factory('MyLoader', MyLoader);

})();