var MyForm = function($rootScope, $window, $timeout, myCaptchaService, myModalService) {

  MyForm = function(config) {

    if (config.ctrlId) { this.ctrlId = config.ctrlId; }

    this.model = config.model;
    this.onSubmit = config.onSubmit;
    this.onSubmitSuccess = config.onSubmitSuccess;
    this.onSubmitError = config.onSubmitError;
    this.onCancel = config.onCancel;
  };

  MyForm.prototype.submit = function() {

    var that = this;

    if (!that.scope.captcha || that.scope.captcha.visible === false) {

      that.scope.loader.start(false, function() {
        that.model.trimValues(that.scope.ctrlId, function() {

          var args = {};
          args.captchaResponse = myCaptchaService.getResponse(that.scope.captcha);

          // Calling external submit action, usually making http request
          var promise = that.onSubmit(args);

          if (promise) {

            promise.then(function(res) {

              var cb = function() { if (that.onSubmitSuccess) { that.onSubmitSuccess(res); } };

              if (!that.scope.redirectOnSuccess) {
                that.model.clearErrors(function() {
                  that.scope.loader.stop(cb);
                });
              } else { cb(); }

            }, function(res) {

              // Binding errors if any
              if (res && res.data && res.data.errors) {
                that.scope.loader.stop(function() {
                  that.model.setErrors(res.data.errors);
                });

              // Showing error modal when no server errors to bind
              } else {
                that.model.clearErrors(function() {
                  that.scope.loader.stop(function() {
                    myModalService.showCustom('tryAgainLaterModal');
                  });
                });
              }

              if (that.scope.captcha) {
                myCaptchaService.shouldBeVisible(that.scope.captcha.ctrlId, function(visible) {
                  $timeout(function() { that.scope.captcha.visible = visible; }, 500);
                });
              }

              if (that.onSubmitError) { that.onSubmitError(res); }
            });
          }
        });
      });
    }
  };

  MyForm.prototype.reset = function() {

    this.model.reset(true, true, true);
  };

  MyForm.prototype.clear = function() {

    this.model.reset(true, true);
  };

  return MyForm;
};

MyForm.$inject = ['$rootScope', '$window', '$timeout', 'myCaptchaService', 'myModalService'];
angular.module('appModule').factory('MyForm', MyForm);