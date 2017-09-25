(function() {

  'use strict';

  var storageService = function(myStorageConf, MyStorageItem) {

    var storageItems = {};

    angular.forEach(myStorageConf, function(config, key) {
      storageItems[key] = new MyStorageItem(config);
    });



    return storageItems;

  };



  storageService.$inject = ['myStorageConf', 'MyStorageItem'];
  angular.module('appModule').service('storageService', storageService);

})();