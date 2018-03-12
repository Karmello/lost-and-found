var myCaptchaService = function(sessionService) {
  return {
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
};

myCaptchaService.$inject = ['sessionService'];
angular.module('appModule').service('myCaptchaService', myCaptchaService);