(function() {

	'use strict';

	var MyForm = function($rootScope, $window, $timeout, grecaptchaService) {

		MyForm = function(config) {

			this.ctrlId = config.ctrlId;
			this.model = config.model;
			this.reload = config.reload;
			this.noLoader = config.noLoader;
			this.redirectOnSuccess = config.redirectOnSuccess;

			this.submitAction = config.submitAction;
			this.submitSuccessCb = config.submitSuccessCb;
			this.submitErrorCb = config.submitErrorCb;
			this.onCancel = config.onCancel;
		};

		MyForm.prototype.submit = function() {

			var that = this;

			if (!that.scope.captcha || that.scope.captcha.visible === false) {

				// Starting loader
				that.scope.loader.start(false, function() {

					// Model procedures
					that.model.trimValues(that.scope.ctrlId, function() {

						var args = {};
						args.captchaResponse = grecaptchaService.getResponse(that.scope.captcha);

						// Calling external submit action, usually making http request
						var promise = that.submitAction(args);

						if (promise) {

							promise.then(function(res) {

								if (!that.redirectOnSuccess) {
									that.model.clearErrors(function() {
										$timeout(function() {
											that.scope.loader.stop();
										});
									});
								}

								if (that.submitSuccessCb) { that.submitSuccessCb(res); }

							}, function(res) {

								// Binding errors if any
								if (res && res.data && res.data.errors) {
									that.scope.loader.stop(function() {
										$timeout(function() { that.model.setErrors(res.data.errors); });
									});

								// Showing error modal when no server errors to bind
								} else {

									that.model.clearErrors(function() {
										$timeout(function() {
											that.scope.loader.stop(function() {
												$rootScope.ui.modals.tryAgainLaterModal.show();
											});
										});
									});
								}

								if (that.scope.captcha) {
									grecaptchaService.shouldBeVisible(that.scope.captcha.ctrlId, function(visible) {
										$timeout(function() { that.scope.captcha.visible = visible; }, 500);
									});
								}

								if (that.submitErrorCb) { that.submitErrorCb(res); }
							});
						}
					});
				});
			}
		};

		MyForm.prototype.clear = function() {

			this.model.reset(true, true);
		};

		MyForm.prototype.reset = function() {

			this.model.reset(true, true, true);
		};

		return MyForm;
	};

	MyForm.$inject = ['$rootScope', '$window', '$timeout', 'grecaptchaService'];
	angular.module('appModule').factory('MyForm', MyForm);

})();