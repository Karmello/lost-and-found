var myWidgets = function() {
  return {
    showInfo: false
  };
};

myWidgets.$inject = [];
angular.module('appModule').service('myWidgets', myWidgets);