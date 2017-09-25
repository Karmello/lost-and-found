(function() {

  'use strict';

  var hardDataService = function(hardDataConst, sessionConst) {

    var self = {
      all: hardDataConst,
      get: function() {

        return hardDataConst[sessionConst.language || 'en'];
      },
      bind: function(scope) {

        var hardDataSettings;

        if (scope.hardData) {
          hardDataSettings = scope.hardData;

        } else if (scope.ins && scope.ins.hardData) {
          hardDataSettings = scope.ins.hardData;
        }



        // There are hard data settings declared on current ctrl
        if (hardDataSettings) {

          // Getting hard data in active language
          var hardData = self.get();

          // For each setting
          angular.forEach(hardDataSettings, function(fieldSettings, fieldName) {

            var groupName = fieldSettings[0];

            if (Array.isArray(fieldSettings[1])) {

              var stringIndexes = fieldSettings[1];
              var fieldNameParts = fieldName.split('_');

              if (fieldNameParts.length == 2 && fieldNameParts[0] == 'switchers') {

                var i = 0;
                fieldName = fieldNameParts[1];

                angular.forEach(scope.ins.switchers, function(switcher, childKey) {
                  if (typeof switcher == 'object') {
                    switcher[fieldName] = hardData[groupName][stringIndexes[i++]];
                  }
                });

              } else {

                scope[fieldName] = [];

                angular.forEach(stringIndexes, function(stringIndex) {
                  scope[fieldName].push(hardData[groupName][stringIndex]);
                });
              }

            } else {

              var stringIndex = fieldSettings[1];
              scope[fieldName] = hardData[groupName][stringIndex];
            }
          });
        }



        if (scope.ins) {

          angular.forEach(scope.ins.switchers, function(switcher, key) {

            if (typeof switcher.label == 'object') {
              switcher.label = switcher.label[self.get()._id];
            }
          });
        }
      }
    };



    return self;
  };



  hardDataService.$inject = ['hardDataConst', 'sessionConst'];
  angular.module('appModule').service('hardDataService', hardDataService);

})();