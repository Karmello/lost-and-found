angular.module('appModule').config(function($stateProvider) {

  $stateProvider.state('app.report.tabs', {
    url: '/:tab',
    onEnter: function($stateParams, ui) {

      ui.tabs.report.activateSwitcher($stateParams.tab);
    }
  });
});