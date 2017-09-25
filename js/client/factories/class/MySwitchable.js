(function() {

  'use strict';

  var MySwitchable = function(MySwitcher) {

    var MySwitchable = function(config) {

      Object.assign(this, $.extend(true, {}, config));
      this.instantiateSwitchers();
    };



    MySwitchable.prototype.instantiateSwitchers = function(switchers, cb) {

      var that = this;
      if (switchers) { that.switchers = switchers; }

      if (that.switchers) {

        that.switcherIds = [];

        angular.forEach(that.switchers, function(switcher, key) {

          if (typeof(switcher) == 'object') {
            that.switchers[key] = new MySwitcher(switcher, that);
            that.switcherIds.push(switcher._id);
          }
        });

        that.activeSwitcherId = that.switcherIds[0];
      }

      if (cb) { cb(); }
    };

    MySwitchable.prototype.activateSwitcher = function(switcherId) {

      var index;

      switch(switcherId) {

        case 'prev':

          index = this.getActiveSwitcherIndex();
          if (index > 0) { this.switchers[index - 1].activate(); } else { this.switchers[this.switchers.length - 1].activate(); }
          break;

        case 'next':

          index = this.getActiveSwitcherIndex();
          if (index < this.switchers.length - 1) { this.switchers[index + 1].activate(); } else { this.switchers[0].activate(); }
          break;

        default:

          var switcher = this.getSwitcher('_id', switcherId);
          if (switcher) { switcher.activate(); } else { this.activeSwitcherId = undefined; }
          break;
      }
    };

    MySwitchable.prototype.getSwitcher = function(key, value) {

      var that = this;

      if (that.switchers) {

        return _.find(that.switchers, function(switcher) {
          return switcher[key] == value;
        });

      } else { return null; }
    };

    MySwitchable.prototype.getActiveSwitcher = function() {

      var that = this;

      return _.find(that.switchers, function(switcher) {
        return switcher._id == that.activeSwitcherId;
      });
    };

    MySwitchable.prototype.getActiveSwitcherIndex = function () {

      var activeSwitcher = this.getActiveSwitcher();

      for (var i = 0; i < this.switchers.length; i++) {
        if (this.switchers[i]._id == activeSwitcher._id) {
          return i;
        }
      }

      return -1;
    };

    MySwitchable.prototype.getFirstSwitcher = function() {

      return _.head(this.switchers);
    };

    return MySwitchable;
  };

  MySwitchable.$inject = ['MySwitcher'];
  angular.module('appModule').factory('MySwitchable', MySwitchable);

})();