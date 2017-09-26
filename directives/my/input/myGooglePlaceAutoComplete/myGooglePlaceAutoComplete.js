(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('myGooglePlaceAutoComplete', function() {

    var myGooglePlaceAutoComplete = {
      restrict: 'E',
      templateUrl: 'public/templates/myGooglePlaceAutoComplete.html',
      scope: {
        ctrlId: '=',
        model: '=',
        hardData: '<',
        hideErrors: '=',
        autocomplete: '='
      },
      controller: function($scope) {},
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {

          var initAutoComplete = function() {

            var input = $(elem).find('input').get()[0];

            scope.autocomplete.ins = new google.maps.places.Autocomplete(input);
            scope.autocomplete.label = null;

            scope.autocomplete.ins.addListener('place_changed', function() {

              var place = scope.autocomplete.ins.getPlace();

              if (place) {
                scope.autocomplete.label = place.formatted_address;
                scope.$apply();
              }
            });
          };

          scope.$watch('model.value.active', function(newValue, oldValue) {

            if (!newValue) {
              initAutoComplete();

            } else {

              var geocoder = new google.maps.Geocoder();

              geocoder.geocode({ 'address': newValue }, function(results, status) {

                if (status == 'OK' && results) {
                  if (newValue == results[0].formatted_address) {
                    scope.autocomplete.ins.set('place', results[0]);
                  }
                }
              });
            }
          });

          initAutoComplete();
        };
      }
    };

    return myGooglePlaceAutoComplete;
  });

})();