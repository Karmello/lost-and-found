(function() {

  'use strict';

  var MySwitcher = function() {

    var MySwitcher = function(config, parent) {

      Object.assign(this, config);
      this.parent = parent;
    };

    MySwitcher.prototype.activate = function(args) {

      this.parent.activeSwitcherId = this._id;
      if (this.onActivate) { this.onActivate(args); }
    };

    return MySwitcher;
  };



  MySwitcher.$inject = [];
  angular.module('appModule').factory('MySwitcher', MySwitcher);

})();