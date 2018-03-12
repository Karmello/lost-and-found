var localData = function() {
  return {
    countries: { data: undefined }
  };
};

localData.$inject = [];
angular.module('appModule').service('localData', localData);