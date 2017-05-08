(function() {

	'use strict';

	var MyFile = function($http) {

		var MyFile = function(url, alterData) {

			this.url = url;
			this.alterData = alterData;

			this.data = undefined;
		};

		MyFile.prototype.readFile = function(cb) {

			var that = this;

			$http.get(that.url).success(function(res) {

				that.data = res;
				if (cb) { cb(true); }

			}).error(function() {

				that.data = undefined;
				if (cb) { cb(false); }
			});
		};

		return MyFile;
	};



	MyFile.$inject = ['$http'];
	angular.module('appModule').factory('MyFile', MyFile);

})();