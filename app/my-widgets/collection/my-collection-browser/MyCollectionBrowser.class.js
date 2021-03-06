var MyCollectionBrowser = function($q, $timeout, hardDataService, MyCollectionSelector, MySwitchable, MyLoader) {

  var hardData = hardDataService.get();

  var MyCollectionBrowser = function(config) {

    Object.assign(MyCollectionBrowser.prototype, $.extend(true, {}, MyCollectionSelector.prototype));

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

      for (var i in this.sorter.switchers) { this.sorter.switchers[i].onClick = this.onClick; }

      this.orderer = new MySwitchable({
        switchers: [
          { _id: 'asc', label: hardData.status[3] },
          { _id: 'desc', label: hardData.status[4] }
        ]
      });

      this.orderer._id = 'orderer';
    }

    // Other
    this.refresher = {};
    this.loader = new MyLoader(250);
  };

  MyCollectionBrowser.prototype.init = function(cb) {

    var that = this;
    var i;

    // Fetching collection to display

    try {

      that.loader.start(false, function() {

        if (that.beforeInit) { that.beforeInit(); }

        that.fetchData(that.createFetchQuery()).then(function(res) {

          // Setting collection
          that.collection = res.data;

          // Initializing pager ctrl

          if (that.noPager) { that.meta.count = that.collection.length; }

          if (that.meta.count > 0) {

            var numOfPages = Math.ceil(that.meta.count / that.singlePageSize);
            var pagerSwitchers = [];

            if (!that.reverseOrder) {
              for (i = 0; i < numOfPages; i++) {
                pagerSwitchers.push({ _id: i + 1, label: '#' + (i + 1) });
              }

            } else {
              for (i = 0; i < numOfPages; i++) {
                pagerSwitchers.push({ _id: i + 1, label: '#' + (numOfPages - i) });
              }
            }

            var currentPage;

            if (that.pager) {
              currentPage = that.pager.activeSwitcherId;
            }

            that.pager = new MySwitchable({ _id: 'pager', switchers: pagerSwitchers });

            if (currentPage) {
              that.pager.activateSwitcher(currentPage);
            }

          } else { that.pager = undefined; }



          // Setting collection elems pos numbers

          for (i = 0; i < that.collection.length; i++) {
            that.collection[i].elemPosition = that.getElemPosition(i);
          }

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
          that.loader.stop(function() {
            if (cb) { cb.call(that, true); }
          });

        }, function(res) {

          that.flush();
          that.loader.stop(function() { if (cb) { cb.call(that, false); } });
        });
      });

    } catch (ex) {

      that.flush();
      that.loader.stop(function() { if (cb) { cb.call(that, false); } });
    }
  };

  MyCollectionBrowser.prototype.onRefreshClick = function() {

    var that = this;

    var currentPage;
    if (that.pager) { currentPage = that.pager.activeSwitcherId; }

    that.init(function() {

      if (that.pager && angular.isDefined(currentPage)) {

        if (currentPage <= that.pager.switcherIds.length) {
          that.pager.activateSwitcher(currentPage);

        } else {
          that.pager = undefined;
          that.onRefreshClick();
        }
      }

      if (that.refreshCb) { that.refreshCb(); }
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

  MyCollectionBrowser.prototype.getElemPosition = function(index, reversed) {

    if (this.pager && this.pager.activeSwitcherId) {

      if (!this.reverseOrder) {
        return (this.pager.activeSwitcherId - 1) * this.singlePageSize + index + 1;

      } else {
        return this.meta.count - index - this.singlePageSize * (this.pager.activeSwitcherId - 1);
      }
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

    this.meta = undefined;
    this.collection = undefined;
  };

  MyCollectionBrowser.prototype.isReady = function() {

    return !this.loader.isLoading && this.refresher;
  };

  return MyCollectionBrowser;
};

MyCollectionBrowser.$inject = ['$q', '$timeout', 'hardDataService', 'MyCollectionSelector', 'MySwitchable', 'MyLoader'];
angular.module('appModule').factory('MyCollectionBrowser', MyCollectionBrowser);