(function() {

	'use strict';

	var MySrcCollection = function($rootScope, $q, MyCollectionSelector, MySrc, MyLoader) {

		var MySrcCollection = function(conf) {

			Object.assign(MySrcCollection.prototype, MyCollectionSelector.prototype);

			if (conf) {

				this.srcArgs = {
					defaultUrl: conf.defaultUrl,
					constructUrl: conf.constructUrl,
					uploadRequest: conf.uploadRequest,
					removeRequest: conf.removeRequest
				};
			}

			this.collection = [];
			this.loader = new MyLoader(250);
		};

		MySrcCollection.prototype.init = function(collection, cb, args) {

			var that = this;

			that.loader.start(false, function() {

				// When there is some init data
				if (collection.length > 0) {

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
						if (!args || !args.doNotLoad) {
							loadPromises.push(that.collection[i].load(src.constructUrl(i)));
						}
					}

					if (!args || !args.doNotLoad) {

						// Returning all loading finished promises
						$q.all(loadPromises).then(function(results) {

							that.loader.stop();
							if (cb) { cb(results); }
						});

					} else {

						that.loader.stop();
						if (cb) { cb(); }
					}

				} else {

					// Emptying collection array
					that.collection.length = 0;

					that.loader.stop();
					if (cb) { cb(); }
				}
			});
		};

		MySrcCollection.prototype.updateSingle = function(args, cb) {

			var that = this;

			// Creating new src
			var newSrc = new MySrc(that.srcArgs);
			newSrc.index = args.src.index;

			// Replacing in new array
			that.collection[newSrc.index] = newSrc;

			// Updating
			newSrc.update(args, 0).then(function(success) {

				// If error while updating
				if (!success) {

					// Setting new src back to old one
					that.collection[args.src.index] = args.src;

					// Showing modal
					$rootScope.ui.modals.tryAgainLaterModal.show();
				}

				if (cb) { cb(success); }
			});
		};

		MySrcCollection.prototype.addToSet = function(args, cb) {

			var that = this;
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
					updatePromises.push(src.update(args, i));
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

				if (results.length > that.collection.length) {
					that.resetIndexes();
				}

				if (cb) { cb(results); }
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
					title: $rootScope.hardData.labels[28] + ' (' + args.collection.length + ')',
					acceptCb: function() {

						var promises = [];

						for (var i = 0; i < args.collection.length; i++) {
							promises.push(args.collection[i].remove());
						}

						$q.all(promises).then(function(results) {

							// For all results backwards
							for (var i = results.length - 1; i >= 0; i--) {

								// If successfull delete
								if (results[i]) {

									// Removing src from array
									that.collection.splice(args.collection[i].index, 1);
								}
							}

							that.resetIndexes();
							cb(results);
						});
					},
					dismissCb: function() {

						if (cb) { cb(); }
					}
				});
			}
		};

		MySrcCollection.prototype.moveSingle = function(direction, src, cb) {

			var that = this;

			if (that.collection.length > 1) {

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

				that.resetIndexes();

				if (cb) { cb(); }
			}
		};

		MySrcCollection.prototype.resetIndexes = function() {

			for (var i in this.collection) {
				this.collection[i].index = Number(i);
			}
		};

		return MySrcCollection;
	};

	MySrcCollection.$inject = ['$rootScope', '$q', 'MyCollectionSelector', 'MySrc', 'MyLoader'];
	angular.module('appModule').factory('MySrcCollection', MySrcCollection);

})();