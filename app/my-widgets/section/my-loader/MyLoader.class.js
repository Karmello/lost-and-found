var MyLoader = function($timeout) {

  var MyLoader = function(_minLoadTime, _stopTimeOut) {
    this.isLoading = false;
    if (_minLoadTime) { this.minLoadTime = _minLoadTime; } else { this.minLoadTime = 150; }
    this.stopTimeOut = _stopTimeOut;
  };

  MyLoader.prototype.start = function(stopAutomagically, cb) {
    var that = this;
    that.isLoading = true;
    $timeout(function() {
      if (stopAutomagically) { that.stop(cb); } else if (cb) { cb(); }
    }, that.minLoadTime || 0);
  };

  MyLoader.prototype.stop = function(cb) {
    var that = this;
    $timeout(function() {
      that.isLoading = false;
      if (cb) { cb(); }
    }, that.stopTimeOut || 0);
  };

  return MyLoader;
};

MyLoader.$inject = ['$timeout'];
angular.module('appModule').factory('MyLoader', MyLoader);