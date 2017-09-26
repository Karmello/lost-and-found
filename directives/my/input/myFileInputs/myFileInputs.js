(function() {

  'use strict';

  var appModule = angular.module('appModule');

  appModule.directive('mySingleFileInput', function() {

    var mySingleFileInput = {
      restrict: 'E',
      template: '<input id="mySingleFileInput" name="file" type="file" />',
      scope: true,
      controller: function($scope) {},
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {

          var mySingleFileInput = $(elem).find('#mySingleFileInput').get()[0];
          var onChangeCb;

          scope.$on('displayMySingleFileInput', function(e, args) {
            onChangeCb = args.cb;
            $(mySingleFileInput).val(undefined);
            $(mySingleFileInput).click();
          });

          $(mySingleFileInput).on('change', function(e) {
            if (e.target.files.length > 0) { onChangeCb(e.target.files); }
          });
        };
      }
    };

    return mySingleFileInput;
  });

  appModule.directive('myMultipleFilesInput', function() {

    var myMultipleFilesInput = {
      restrict: 'E',
      template: '<input id="myMultipleFilesInput" name="file" type="file" multiple />',
      scope: true,
      controller: function($scope) {},
      compile: function(elem, attrs) {

        return function(scope, elem, attrs) {

          var myMultipleFilesInput = $(elem).find('#myMultipleFilesInput').get()[0];
          var onChangeCb;

          scope.$on('displayMyMultipleFilesInput', function(e, args) {
            onChangeCb = args.cb;
            $(myMultipleFilesInput).val(undefined);
            $(myMultipleFilesInput).click();
          });

          $(myMultipleFilesInput).on('change', function(e) {
            if (e.target.files.length > 0) { onChangeCb(e.target.files); }
          });
        };
      }
    };

    return myMultipleFilesInput;
  });

})();