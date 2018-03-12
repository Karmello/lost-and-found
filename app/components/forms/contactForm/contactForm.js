angular.module('appModule').directive('contactForm', function($rootScope, ContactTypesRest, MyForm) {
  return {
    restrict: 'E',
    templateUrl: 'public/templates/contactForm.html',
    scope: true,
    controller: function($scope) {

      $scope.myForm = new MyForm({
        model: ContactTypesRest.contactTypeModel,
        onSubmit: function(args) {

          return ContactTypesRest.post(ContactTypesRest.contactTypeModel.getValues());
        },
        onSubmitSuccess: function(res) {

          ContactTypesRest.contactTypeModel.reset(true, true);
        }
      }, $scope);
    },
    compile: function(elem, attrs) {

      return function(scope, elem, attrs) {

        scope.$watch(function() { return $rootScope.apiData.contactTypes; }, function(newValue) {
          scope.contactTypes = newValue;
        });
      };
    }
  };
});