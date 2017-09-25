(function() {

  'use strict';

  var uiSetupService = function($state, $http, $templateCache) {

    var actions = {
      preloadTemplates: function() {

        $http.get('public/templates/all_in_one.html').success(function(res) {

          var template = $(res);

          for (var elem of template) {
            if (elem.id) {
              $templateCache.put('public/templates/' + elem.id + '.html', elem.outerHTML);
            }
          }
        });
      },
      preloadImgs: function() {

        var imgs = ['avatar.png', 'item.png', 'paypal.png'];

        for (var src of imgs) {
          var img = new Image();
          img.src = 'public/imgs/' + src;
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
      },
      reInitCtrls: function() {}
    };

    return actions;
  };



  uiSetupService.$inject = ['$state', '$http', '$templateCache'];
  angular.module('appModule').service('uiSetupService', uiSetupService);

})();