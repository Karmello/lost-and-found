var DeactivationReasonsRest = function(Restangular, MyFormModel) {

  var deactivationReasons = Restangular.service('deactivation_reasons');

  deactivationReasons.deactivationReasonModel = new MyFormModel({
    deactivationReasonId: {}
  });

  return deactivationReasons;
};

DeactivationReasonsRest.$inject = ['Restangular', 'MyFormModel'];
angular.module('appModule').factory('DeactivationReasonsRest', DeactivationReasonsRest);