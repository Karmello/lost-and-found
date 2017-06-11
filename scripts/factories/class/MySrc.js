(function() {

	'use strict';

	var MySrc = function($rootScope, $q, $timeout, MyLoader) {

		var MySrc = function(conf) {

			if (conf) {

				this.defaultUrl = conf.defaultUrl;
				this.constructUrl = conf.constructUrl;
				this.uploadRequest = conf.uploadRequest;
				this.removeRequest = conf.removeRequest;
			}

			this.loader = new MyLoader(250);
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
				$timeout(function() { that.url = url; }, that.loader.minLoadTime);

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

		MySrc.prototype.update = function(args, i) {

			var that = this;

			return $q(function(resolve) {

				that.loader.start(false, function() {

					// Running external procedure
					that.uploadRequest(args, i).then(function(res) {

						if (res.success) {

							if (args.doReload) {

								that.load(that.url, true, function() {
									resolve(res.success);
								});

							} else if (args.getReloadUrl) {

								that.load(args.getReloadUrl(i), true, function() {
									resolve(res.success);
								});

							} else { resolve(res.success); }

						} else {

							that.loader.stop();
							resolve(res.success);
						}
					});
				});
			});
		};

		MySrc.prototype.remove = function(args, doLoadSecondary) {

			var that = this;
			if (!args) { args = {}; }

			return $q(function(resolve) {

				var finish = function(success) {

					if (success) {
						if (doLoadSecondary) {
							that.loadSecondary();
						}

					} else {
						that.loader.stop();
					}

					resolve(success);
				};

				that.loader.start(false, function() {

					if (that.removeRequest) {

						// Running external procedure
						that.removeRequest(args).then(function(success) { finish(success); });

					} else { finish(true); }
				});
			});
		};

		return MySrc;
	};

	MySrc.$inject = ['$rootScope', '$q', '$timeout', 'MyLoader'];
	angular.module('appModule').factory('MySrc', MySrc);

})();