(function() {

  'use strict';

  var reportAvatarService = function(URLS) {

    var service = {
      constructPhotoUrl: function(scope, useThumb) {

        if (!scope.report.avatar) { return scope.src.defaultUrl; }

        if (!useThumb) {
          return URLS.AWS3_UPLOADS_BUCKET_URL + scope.report.userId + '/reports/' + scope.report._id + '/' + scope.report.avatar;

        } else {
          return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + scope.report.userId + '/reports/' + scope.report._id + '/' + scope.report.avatar;
        }
      }
    };

    return service;
  };

  reportAvatarService.$inject = ['URLS'];
  angular.module('appModule').service('reportAvatarService', reportAvatarService);

})();