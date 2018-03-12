var MyBtn = function($timeout) {

  var MyBtn = function(scope) {

    this.scope = scope;
    this.set(0);
  };

  MyBtn.prototype.set = function(mouseState, btnState) {

    var that = this;

    that.scope.activeMouseState = mouseState;
    if (angular.isDefined(btnState)) { that.scope.activeBtnState = btnState; }
  
    if (that.scope.hardData) { that.label = that.getValue('label', mouseState); }
    if (that.scope.btnClass) { that.btnClass = that.getValue('btnClass', mouseState); }
    
    if (that.scope.iconClass) {
      that.iconClass = that.getValue('iconClass', mouseState);
      $timeout(function() { that.iconClass = that.getValue('iconClass', mouseState); });
    }
  };

  MyBtn.prototype.getValue = function(propName, mouseState) {

    var btnState = this.scope.activeBtnState;
    var value;

    switch (propName) {
      case 'label':
        value = this.scope[propName + '_' + btnState + '_' + mouseState];
        break;
      case 'btnClass':
      case 'iconClass':
        try { value = this.scope[propName][btnState][mouseState]; } catch (ex) { value = undefined; }
        break;
    }

    if (!value && (mouseState == 1 || btnState == 1)) {
      return this.getValue(propName, 0);
    } else {
      return value;
    }
  };

  return MyBtn;
};

MyBtn.$inject = ['$timeout'];
angular.module('appModule').factory('MyBtn', MyBtn);