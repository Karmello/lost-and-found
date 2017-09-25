(function() {

  'use strict';

  var apiService = function($rootScope, $window, $timeout, googleMapService, storageService, reportsService, CommentsRest, Restangular) {

    var service = {
      setup: function() {

        Restangular.setBaseUrl('/api');
        Restangular.setFullResponse(true);
        Restangular.setRestangularFields({ id: '_id' });
        Restangular.addResponseInterceptor(service.interceptResponse);

        Restangular.addElementTransformer('users', false, function(user) { return user; });

        Restangular.addElementTransformer('reports', false, function(report) {
          report.startEvent.date = new Date(report.startEvent.date);
          return report;
        });

        Restangular.addElementTransformer('comments', false, function(comment) { return comment; });
      },
      interceptResponse: function(data, operation, what, url, res, deferred) {

        if (data.authToken) { storageService.authToken.setValue(data.authToken); }

        if (data.msg) {
          $timeout(function() {
            var body = { title: data.msg.title, message: data.msg.info };
            if (data.msg.reload) { body.hideCb = function() { $window.location.reload(); }; }
            $rootScope.ui.modals.infoModal.show(body);
          }, 250);
        }



        if (what == 'users') {

          if (operation == 'post') {

            switch (res.config.params.action) {

              case 'authenticate':
              case 'login':
              case 'register':

                $rootScope.apiData.loggedInUser = Restangular.restangularizeElement(undefined, data.user, 'users');
                break;
            }
          }

        } else if (what == 'reports') {

          if (operation == 'getList') {

            switch (res.config.params.subject) {

              case 'bySearchQuery':
              case 'newlyAdded':
              case 'byUser':
              case 'lastViewed':

                reportsService.collectionBrowser[res.config.params.subject].meta = data.meta;
                if (res.config.params.subject == 'bySearchQuery') { googleMapService.searchReportsMap.addMarkers(data.collection); }

                return data.collection;

              case 'singleOne':

                $rootScope.apiData.loggedInUser.reportsRecentlyViewed = data.reportsRecentlyViewed;
                return [data.report];
            }

          } else if (operation == 'post') {

            return Restangular.restangularizeElement(undefined, data, 'reports');
          }

        } else if (what == 'comments') {

          if (operation == 'getList') {

            CommentsRest.activeCollectionBrowser.meta = data.meta;
            return data.collection;
          }
        }

        return data;
      }
    };

    return service;
  };

  apiService.$inject = ['$rootScope', '$window', '$timeout', 'googleMapService', 'storageService', 'reportsService', 'CommentsRest','Restangular'];
  angular.module('appModule').service('apiService', apiService);

})();