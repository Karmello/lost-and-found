(function() {

  angular.module('appModule').config(function($stateProvider) {

    $stateProvider.state('app.settings1', {
      url: '/settings',
      resolve: {
        redirection: function($q, $timeout, $state, ui) {

          return $q(function() {

            // Setting catId and subcatId and going to main.setting3 state

            var catId = ui.listGroups.settings.activeSwitcherId;

            $timeout(function() {
              $state.go('app.settings3', {
                catId: catId,
                subcatId: ui.tabs[catId].activeSwitcherId
              }, { location: 'replace' });
            });
          });
        }
      }
    });
  });

})();