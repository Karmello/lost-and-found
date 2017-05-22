(function() {

	'use strict';

	var grecaptchaService = function(sessionService) {

		var config = {
			captchas: {},
			load: function(ctrlId, actionName, resolveCallback) {

				if (window.grecaptcha) {

					config.captchas[ctrlId] = { actionName: actionName };

					// This returns grecaptchaId
					return window.grecaptcha.render(ctrlId, {
						sitekey: '6LdwIyQTAAAAABj159-NBLYxFY4vPRuqEBrYB_aE',
						callback: function() { resolveCallback(); }
					});
				}
			},
			reset: function(grecaptchaId) {

				if (window.grecaptcha) {
					window.grecaptcha.reset(grecaptchaId);
				}
			},
			getResponse: function(captchaObj) {

				// console.log(captchaObj);

				if (window.grecaptcha && captchaObj) {
					return window.grecaptcha.getResponse(captchaObj.grecaptchaId);
				}
			},
			shouldBeVisible: function(ctrlId, callback) {

				if (window.grecaptcha) {

					sessionService.get().then(function(res) {
						var badActionsCount = res.data.badActionsCount;
						callback(badActionsCount[config.captchas[ctrlId].actionName] >= badActionsCount.max);
					});

				} else { callback(false); }
			}
		};

		return config;
	};



	grecaptchaService.$inject = ['sessionService'];
	angular.module('appModule').service('grecaptchaService', grecaptchaService);

})();