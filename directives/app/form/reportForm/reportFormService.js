(function() {

  'use strict';

  var reportFormService = function($rootScope, $state, $timeout, ReportsRest, Restangular, MyForm) {

    var service = this;

    var getFormSubmitAction = function(scope) {

      switch (scope.action) {

        case 'addReport':

          return function(args) {

            scope.myForm.submitSuccessCb = function(res) {

              $state.go('app.report', { id: res.data._id });

              $timeout(function() {
                scope.myForm.reset();
                scope.myForm.scope.loader.stop();
              }, 500);
            };

            inspectAutoComplete(scope);
            var modelValues = scope.myForm.model.getValues();
            return ReportsRest.post(modelValues);
          };

        case 'editReport':

          return function(args) {

            scope.myForm.submitSuccessCb = function(res) {

              $rootScope.apiData.report = res.data;
              $state.go('app.report', { id: res.data._id, edit: undefined });
            };

            scope.myForm.submitErrorCb = function(res) {

              $rootScope.apiData.report = copy;
            };

            inspectAutoComplete(scope);
            var copy = Restangular.copy($rootScope.apiData.report);
            scope.myForm.model.assignTo(copy);
            return copy.put();
          };

        case 'respondToReport':

          return function(args) {


          };
      }
    };

    var inspectAutoComplete = function(scope) {

      var place = scope.autocomplete.ins.getPlace();
      var myForm = service[scope.action + 'Form'];

      if (place) {

        myForm.model.set({
          startEvent: {
            address: place.formatted_address,
            placeId: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });

      } else {

        myForm.model.setValue('startEvent.address');
        myForm.model.setValue('startEvent.placeId');
        myForm.model.setValue('startEvent.lat');
        myForm.model.setValue('startEvent.lng');
      }
    };

    service.getCurrentDateWithNoTime = function() {

      var date = new Date();
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    };

    service.getForm = function(scope) {

      service[scope.action + 'Form'] = new MyForm({
        ctrlId: scope.action + 'Form',
        redirectOnSuccess: true,
        model: ReportsRest[scope.action + 'Model'],
        submitAction: getFormSubmitAction(scope),
        onCancel: function() {

          if (scope.action != 'respondToReport') {
            $timeout(function() { service[scope.action + 'Form'].reset(); });
            window.history.back();

          } else {
            $rootScope.$broadcast('toggleRespondToReportForm', { visible: false });
          }
        }
      });

      return service[scope.action + 'Form'];
    };

    return service;
  };

  reportFormService.$inject = ['$rootScope', '$state', '$timeout', 'ReportsRest', 'Restangular', 'MyForm'];
  angular.module('appModule').service('reportFormService', reportFormService);

})();