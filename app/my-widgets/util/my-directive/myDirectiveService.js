var myDirectiveService = function(hardDataService) {
  
  var hardData = hardDataService.get();

  return {
    bindHardCodedData: function(scope) {

      var ctrlHardData;

      // Getting ctrl hardcoded data
      if (scope.hardData) {
        ctrlHardData = scope.hardData;

      } else if (scope.ins && scope.ins.hardData) {
        ctrlHardData = scope.ins.hardData;
      }

      // If hardcoded data defined
      if (ctrlHardData) {        

        angular.forEach(ctrlHardData, function(value, key) {

          var groupName = value[0];

          if (Array.isArray(value[1])) {

            var stringIndexes = value[1];
            var keyParts = key.split('_');

            if (keyParts.length == 2 && keyParts[0] == 'switchers') {

              var i = 0;
              key = keyParts[1];

              angular.forEach(scope.ins.switchers, function(switcher) {
                if (typeof switcher == 'object') {
                  switcher[key] = hardData[groupName][stringIndexes[i++]];
                }
              });

            } else {

              scope[key] = [];

              angular.forEach(stringIndexes, function(stringIndex) {
                scope[key].push(hardData[groupName][stringIndex]);
              });
            }

          } else {

            var stringIndex = value[1];
            scope[key] = hardData[groupName][stringIndex];
          }
        });
      }
    },
    evaluateObjectsIntoStrings: function(scope) {

      if (scope.ins) {
        angular.forEach(scope.ins.switchers, function(switcher) {
          if (typeof switcher.label == 'object') {
            switcher.label = switcher.label[hardData._id];
          }
        });
      }
    },
    provideInstanceMembers: function(scope) {

      if (scope.ins) {
        scope.ins.scope = scope;
        if (scope.ctrlId) { scope.ins.ctrlId = scope.ctrlId; }
      }
    }
  };
};

myDirectiveService.$inject = ['hardDataService'];
angular.module('appModule').service('myDirectiveService', myDirectiveService);