(function() {

	'use strict';

	var MySrc = function($rootScope, $q, $timeout, MyLoader) {

		var minLoadTime = 500;

		var MySrc = function(conf) {

			if (conf) {

				this.defaultUrl = conf.defaultUrl;
				this.constructUrl = conf.constructUrl;
				this.uploadRequest = conf.uploadRequest;
				this.removeRequest = conf.removeRequest;
			}

			this.loader = new MyLoader();
		};

		MySrc.prototype.load = function(url, force, cb) {

			var that = this;

			// When no url supplied but construct url method found
			if (!url && that.constructUrl) { url = that.constructUrl(that.index); }

			// When forcing file load
			if (force) { that.url = undefined; }



			// Loading
			if (url != that.url) {

				that.loader.start();
				that.deferred = $q.defer();

				// Load promise cb
				that.deferred.promise.then(function(success) {

					if (!success) {

						if (that.defaultUrl) {
							that.url = that.defaultUrl;
						}
					}

					that.loader.stop();
					if (cb) { cb(success); }
				});

				// Settings new url
				$timeout(function() { that.url = url; }, minLoadTime);

				return that.deferred.promise;
			}
		};

		MySrc.prototype.loadSecondary = function() {

			if (this.defaultUrl) {
				this.load(this.defaultUrl);
			}
		};

		MySrc.prototype.isDefaultUrlLoaded = function() {

			if (this.defaultUrl) {
				return this.url == this.defaultUrl;
			}
		};

		MySrc.prototype.update = function(args, preventReload, i) {

			var that = this;

			return $q(function(resolve) {

				that.loader.start(false, function() {

					// Running external procedure
					that.uploadRequest(args, i).then(function(result) {

						if (result.success) {

							if (!preventReload) {
								that.load(result.url, true);

							} else {
								that.loader.stop();
							}

							resolve(true);

						} else {

							that.loader.stop();
							resolve(false);
						}
					});
				});
			});
		};

		MySrc.prototype.remove = function(args, doLoadSecondary) {

			var that = this;
			if (!args) { args = {}; }

			return $q(function(resolve) {

				that.loader.start(false, function() {

					args._id = that._id;

					// Running external procedure
					that.removeRequest(args).then(function(success) {

						if (success) {
							if (doLoadSecondary) {
								that.loadSecondary();
							}

						} else {
							that.loader.stop();
						}

						resolve(success);
					});
				});
			});
		};

		return MySrc;
	};

	MySrc.$inject = ['$rootScope', '$q', '$timeout', 'MyLoader'];
	angular.module('appModule').factory('MySrc', MySrc);

})();