var uiSetupService = function($state, $http, $templateCache) {

  var actions = {
    preloadTemplates: function() {

      $http.get('public/templates/all_in_one.html').success(function(res) {

        var templates = $(res);

        for (var key in templates) {
          if (templates[key].id) {
            $templateCache.put('public/templates/' + templates[key].id + '.html', templates[key].outerHTML);
          }
        }
      });
    },
    preloadImgs: function() {

      var imgs = ['avatar.png', 'item.png', 'paypal.png'];

      for (var key in imgs) {
        var img = new Image();
        img.src = 'public/imgs/' + imgs[key];
      }
    },
    bindGetRouteMethod: function(uiCtrls) {

      var settingsSwitcher = uiCtrls.frames.main.getSwitcher('_id', 'settings');

      uiCtrls.dropdowns.mainFrameNav.getSwitcher('_id', 'settings').getRoute = function() {
        return settingsSwitcher.getRoute.call(this, uiCtrls);
      };

      angular.forEach(uiCtrls.listGroups.settings.switchers, function(switcher, key) {

        switcher.getRoute = function() {
          return settingsSwitcher.getRoute.call(this, uiCtrls);
        };

        uiCtrls.dropdowns.settingsCategories.switchers[key].getRoute = function() {
          return settingsSwitcher.getRoute.call(this, uiCtrls);
        };
      });
    }
  };

  return actions;
};

uiSetupService.$inject = ['$state', '$http', '$templateCache'];
angular.module('appModule').service('uiSetupService', uiSetupService);