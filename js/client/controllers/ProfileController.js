(function() {

  'use strict';

  var ProfileController = function($scope, $moment, contextMenuConf, reportsService) {

    $scope.collectionBrowser = reportsService.collectionBrowser.byUser;
    $scope.profileReportsContextMenuConf = contextMenuConf.profileReportsContextMenuConf;

    $scope.$watch('apiData.profileUser', function(newUser) {
      if (newUser) { $scope.userSince = $moment.duration($moment(new Date()).diff($moment(newUser.registration_date))).humanize(); }
    });
  };

  ProfileController.$inject = ['$scope', '$moment', 'contextMenuConf', 'reportsService'];
  angular.module('appModule').controller('ProfileController', ProfileController);

})();