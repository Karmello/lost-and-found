var MyModal = function($rootScope, $timeout) {

  var MyModal = function(config) {

    Object.assign(this, config);
  };

  MyModal.prototype.timeout = 500;

  MyModal.prototype.show = function() {

    var that = this;

    if ($rootScope.isAnyModalOpen) {
      $('.modal').modal('hide');
      $timeout(function() { $('#' + that.id).modal('show'); }, that.timeout);

    } else {
      $timeout(function() { $('#' + that.id).modal('show'); });
    }
  };

  MyModal.prototype.hide = function(cb) {

    $('#' + this.id).modal('hide');
    if (cb) { $timeout(function() { cb(); }, this.timeout); }
  };

  MyModal.prototype.accept = function() {

    var that = this;
    $('#' + that.id).modal('hide');
    if (that.acceptCb) { $timeout(function() { that.acceptCb(); }, that.timeout); }
  };
  
  MyModal.prototype.dismiss = function() {

    var that = this;
    $('#' + that.id).modal('hide');
    if (that.dismissCb) { $timeout(function() { that.dismissCb(); }, that.timeout); }
  };

  return MyModal;
};

MyModal.$inject = ['$rootScope', '$timeout'];
angular.module('appModule').factory('MyModal', MyModal);