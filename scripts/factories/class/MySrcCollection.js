(function() {

	'use strict';

	var MySrcCollection = function($rootScope, $q, MyCollectionSelector, MySrc, MyLoader) {

		var MySrcCollection = function(conf) {

			Object.assign(MySrcCollection.prototype, MyCollectionSelector.prototype);

			if (conf) {

				this.remove = conf.remove;

				this.srcArgs = {
					defaultUrl: conf.defaultUrl,
					constructUrl: conf.constructUrl,
					uploadRequest: conf.uploadRequest,
					removeRequest: conf.removeRequest
				};
			}

			this.collection = [];
			this.loader = new MyLoader();
		};

		MySrcCollection.prototype.init = function(collection, cb) {

			var that = this;

			// When there is some init data
			if (collection.length > 0) {

				that.loader.start(false, function() {

					// Emptying collection array
					that.collection.length = 0;

					var loadPromises = [];

					// For all elem in collection
					for (var i in collection) {

						// Creating src
						var src = new MySrc(that.srcArgs);
						src.index = Number(i);

						// Assigning collection elem fields to newly created src
						Object.assign(src, collection[i]);

						// Pushing to an array
						that.collection.push(src);

						// Loading
						loadPromises.push(that.collection[i].load(src.constructUrl(i)));
					}

					// Returning all loading finished promises
					$q.all(loadPromises).then(function(results) {
						that.loader.stop();
						if (cb) { cb(results); }
					});
				});

			} else {

				// Emptying collection array
				that.collection.length = 0;

				if (cb) { cb(); }
			}
		};

		MySrcCollection.prototype.updateSingle = function(args, cb) {

			var that = this;

			// Creating new src
			var newSrc = new MySrc(that.srcArgs);
			newSrc.index = args.src.index;

			// Replacing in new array
			that.collection[newSrc.index] = newSrc;

			// Updating
			newSrc.uploadRequest(args, undefined, 0).then(function(result) {

				// If error while updating
				if (!result) {

					// Setting new src back to old one
					that.collection[src.index] = src;
				}

				if (cb) { cb(result); }
			});
		};

		MySrcCollection.prototype.addToSet = function(args, cb) {

			var that = this;

			that.loader.start(false, function() {

				var updatePromises = [];

				// Getting current collection count
				var count = that.collection.length;

				// For all input files
				for (var i in args.inputData) {

					// If inputData element is of File class
					if (args.inputData[i] instanceof File) {

						// Creating src
						var src = new MySrc(that.srcArgs);
						src.index = Number(i) + count;
						that.collection.push(src);

						// Updating src
						updatePromises.push(src.uploadRequest(args, i, Number(i)));
					}
				}

				// When all updates done
				$q.all(updatePromises).then(function(results) {

					// For all results backwards
					for (var i = results.length - 1; i >= 0; i--) {

						// If unsuccessfull update
						if (!results[i]) {

							// Removing src from array
							that.collection.splice(Number(i) + count, 1);
						}
					}

					if (cb) { cb(results); }
				});
			});
		};

		MySrcCollection.prototype.removeFromSet = function(args, cb) {

			var that = this;

			if (args.collection.length === 0) {

				// Showing info modal
				$rootScope.ui.modals.infoModal.show({
					title: $rootScope.apiData.loggedInUser.username,
					message: $rootScope.hardData.rejections[8],
					hideCb: function() { cb(false); }
				});

			} else {

				// Showing confirmation modal
				$rootScope.ui.modals.confirmProceedModal.show({
					title: $rootScope.hardData.labels[28],
					acceptCb: function() {

						that.loader.start(false, function() {

							var indexes = [];

							// For all srcs to delete
							for (var i in args.collection) {
								indexes.push(args.collection[i].index);
							}

							// Running external procedure
							that.remove(indexes).then(function(res) {

								// When success
								if (cb) { cb(true, res.data); }

							}, function(res) {

								// When failure
								if (cb) { cb(false, res.data); }
							});
						});
					},
					hideCb: function() {
						if (cb) { cb(); }
					}
				});
			}
		};

		MySrcCollection.prototype.moveSingle = function(direction, src, cb) {

			var that = this;

			if (that.collection.length > 1) {

				that.loader.start(false, function() {

					src = that.collection.splice(src.index, 1)[0];

					switch (direction) {

						case 'moveLeft':

							if (src.index > 0) {
								that.collection.splice(src.index - 1, 0, src);

							} else {
								that.collection.splice(that.collection.length, 0, src);
							}

							break;

						case 'moveRight':

							if (src.index < that.collection.length) {
								that.collection.splice(src.index + 1, 0, src);

							} else {
								that.collection.splice(0, 0, src);
							}

							break;
					}

					for (var i in that.collection) {
						that.collection[i].index = Number(i);
					}

					if (cb) { cb(); }
				});
			}
		};

		return MySrcCollection;
	};

	MySrcCollection.$inject = ['$rootScope', '$q', 'MyCollectionSelector', 'MySrc', 'MyLoader'];
	angular.module('appModule').factory('MySrcCollection', MySrcCollection);

})();