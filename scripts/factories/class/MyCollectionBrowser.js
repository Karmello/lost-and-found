(function() {

	'use strict';

	var MyCollectionBrowser = function(hardDataService, MyCollectionSelector, MySwitchable, MyLoader) {

		var hardData = hardDataService.get();

		var MyCollectionBrowser = function(config) {

			Object.assign(MyCollectionBrowser.prototype, MyCollectionSelector.prototype);

			// Assigning config
			Object.assign(this, config);

			// Defining ctrls configs
			this.ctrls = [
				{ name: 'pager', paramName: 'page' },
				{ name: 'filterer', paramName: 'filter' },
				{ name: 'sorter', paramName: 'sort' },
				{ name: 'orderer', paramName: 'order' }
			];

			// Initializing filterer
			if (this.filterer) {
				this.filterer = new MySwitchable(this.filterer);
				this.filterer._id = 'filterer';
			}

			// Initializing sorter and orderer
			if (this.sorter) {

				this.sorter = new MySwitchable(this.sorter);
				this.sorter._id = 'sorter';
				this.sorter.togglerLabel = hardData.phrases[90];

				for (var i in this.sorter.switchers) { this.sorter.switchers[i].onClick = this.onClick; }

				this.orderer = new MySwitchable({
					switchers: [
						{ _id: 'asc', label: hardData.phrases[87] },
						{ _id: 'desc', label: hardData.phrases[88] }
					]
				});

				this.orderer._id = 'orderer';
			}

			// Creating loader
			this.loader = new MyLoader();
		};

		MyCollectionBrowser.prototype.init = function(cb) {

			var that = this;

			that.loader.start(false, function() {

				// Fetching collection to display

				try {

					that.fetchData(that.createFetchQuery()).then(function(res) {

						// Initializing pager ctrl

						if (that.meta.count > 0) {

							var numOfPages = Math.ceil(that.meta.count / that.singlePageSize);
							var pagerSwitchers = [];

							for (var i = 0; i < numOfPages; i++) {
								pagerSwitchers.push({ _id: i + 1, label: '#' + (i + 1) });
							}

							var currentPage;

							if (that.pager) {
								currentPage = that.pager.activeSwitcherId;
							}

							that.pager = new MySwitchable({ _id: 'pager', switchers: pagerSwitchers });
							that.pager.togglerLabel = hardData.phrases[89];

							if (currentPage) {
								that.pager.activateSwitcher(currentPage);
							}

						} else { that.pager = undefined; }

						// Binding choose event for all ctrls

						var exec = function(switcher) {
							switcher.onClick = function() { that.onChoose(switcher); };
						};

						for (var j in that.ctrls) {
							if (that[that.ctrls[j].name]) {
								angular.forEach(that[that.ctrls[j].name].switchers, exec);
							}
						}

						// Finishing
						that.updateRefresher();
						that.loader.stop(function() { if (cb) { cb(true); } });

					}, function(res) {

						that.flush();
						that.loader.stop(function() { if (cb) { cb(false); } });
					});

				} catch (ex) {

					that.flush();
					that.loader.stop(function() { if (cb) { cb(false); } });
				}
			});
		};

		MyCollectionBrowser.prototype.setData = function(data) {

			this.meta = data.meta;
			this.collection = data.collection;
		};

		MyCollectionBrowser.prototype.onRefreshClick = function() {

			var that = this;

			var currentPage;
			if (that.pager) { currentPage = that.pager.activeSwitcherId; }

			that.init(function() {

				if (that.pager && angular.isDefined(currentPage)) {
					that.pager.activateSwitcher(currentPage);
				}
			});
		};

		MyCollectionBrowser.prototype.createFetchQuery = function() {

			var query = {};

			if (this.pager && this.pager.activeSwitcherId) {
				query.skip = (this.pager.activeSwitcherId - 1) * this.singlePageSize;

			} else { query.skip = 0; }

			if (this.filterer) {
				query.filter = this.filterer.activeSwitcherId;
			}

			if (this.sorter) {
				query.sort = this.sorter.activeSwitcherId;
				if (this.orderer && this.orderer.activeSwitcherId == 'desc') { query.sort = '-' + query.sort; }
			}

			if (this.orderer) {
				query.order = this.orderer.activeSwitcherId;
			}

			return query;
		};

		MyCollectionBrowser.prototype.updateRefresher = function() {

			this.refresher = {};

			if (this.collection) {

				if (this.meta.count > 0) {
					this.refresher.refresherLabel = hardData.phrases[92] + ' ' + this.meta.count;

				} else {
					this.refresher.refresherLabel = hardData.phrases[64];
				}
			}

			if (this.meta.count > 0) {
				this.refresher.class = 'btn-info';

			} else {
				this.refresher.class = 'btn-warning';
			}
		};

		MyCollectionBrowser.prototype.getElemNumber = function(index) {

			if (this.pager && this.pager.activeSwitcherId) {
				return (this.pager.activeSwitcherId - 1) * this.singlePageSize + index + 1;
			}
		};

		MyCollectionBrowser.prototype.onChoose = function(switcher) {

			var that = this;
			var currentPage;

			// If choosing inactive switcher
			if (switcher._id != switcher.parent.activeSwitcherId) {

				// Activating chosen switcher
				switcher.activate();

				// Storing pager's active switcher id for later
				if (that.pager) {
					currentPage = that.pager.activeSwitcherId;
				}

				if (switcher.parent._id == 'pager') {

					// Reinitializing
					that.init(function() {

						// Activating stored pager's switcher
						if (that.pager && angular.isDefined(currentPage)) {
							that.pager.activateSwitcher(currentPage);
						}

						// If ctrl other than pager is being switched
						if (switcher.parent._id !== 'pager') {
							that[switcher.parent._id].activateSwitcher(switcher._id);
						}
					});
				}
			}
		};

		MyCollectionBrowser.prototype.flush = function() {

			this.pager = undefined;
			this.filterer = undefined;
			this.sorter = undefined;
			this.orderer = undefined;
		};

		MyCollectionBrowser.prototype.isReady = function() {

			return !this.loader.isLoading && this.refresher;
		};

		return MyCollectionBrowser;
	};

	MyCollectionBrowser.$inject = ['hardDataService', 'MyCollectionSelector', 'MySwitchable', 'MyLoader'];
	angular.module('appModule').factory('MyCollectionBrowser', MyCollectionBrowser);

})();