(function() {

  angular.module('appModule')
    .run(function($rootScope, $timeout, $state, $moment, apiService, logService, ui, uiThemeService, sessionConst, reportsService, uiSetupService) {

      ui.loaders.renderer.start();

      uiSetupService.preloadTemplates(ui);
      uiSetupService.preloadImgs();
      uiThemeService.include(sessionConst.theme);

      apiService.setup();

      $moment.locale(sessionConst.language);

      if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }



      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if (fromState != toState) { $('.modal').modal('hide'); }
      });

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        reportsService.initReports(fromState, fromParams, toState, toParams);



        switch (toState.name) {

          case 'app.start':
          case 'app.settings3':

            if (toState.name == fromState.name) { return; } else {
              fromState.scrollY = window.scrollY;
              window.scrollTo(0, 0);
            }

            break;

          case 'app.profile':
          case 'app.report':

            if (toParams.edit === '1') {
              window.scrollTo(0, 0);
              return;

            } else {

              let lastId = toState.lastId;
              toState.lastId = toParams.id;
              fromState.scrollY = window.scrollY;
              window.scrollTo(0, 0);
              if (lastId != toParams.id || fromParams.edit === '1') { return; }
            }

            break;

          case 'app.report.tabs':
            return;

          default:
            fromState.scrollY = window.scrollY;
            window.scrollTo(0, 0);
            break;
        }

        if (toState.scrollY) {
          $timeout(function() {
            $('html, body').animate({ scrollTop: toState.scrollY }, 'fast');
          }, 500);
        }
      });
    });

})();