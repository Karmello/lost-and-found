angular.module('appModule').directive('myTextArea', function() {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/myTextArea.html',
    scope: {
      ctrlId: '=',
      ctrlMaxLength: '=',
      model: '=',
      autoResizable: '<',
      hardData: '<'
    },
    controller: function($scope) {},
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        if (scope.autoResizable) {

          var textarea = $(elem).find('textarea').get()[0];
          $(textarea).css('overflow', 'hidden');

          scope.resize = function(height) {
            $(textarea).css('height', 'auto');
            $(textarea).css('height', height || $(textarea).prop('scrollHeight') + 'px');
          };

          scope.$watch('model.value.active', function(newValue, oldValue) {
            if (!newValue) { scope.resize(65); }
          });
        }
      };
    }
  };
});