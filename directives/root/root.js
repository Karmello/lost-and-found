(function() {

  'use strict';

  angular.module('appModule').directive('root', () => {
    return {
      restrict: 'E',
      templateUrl: 'public/templates/root.html',
    };
  });
})();