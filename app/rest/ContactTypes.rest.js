var ContactTypesRest = function(Restangular, MyFormModel) {

  var contactTypes = Restangular.service('contact_types');

  contactTypes.contactTypeModel = new MyFormModel({
    contactType: {},
    contactMsg: {}
  });

  return contactTypes;
};

ContactTypesRest.$inject = ['Restangular', 'MyFormModel'];
angular.module('appModule').factory('ContactTypesRest', ContactTypesRest);