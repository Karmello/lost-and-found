var ProfileController = function($scope, $moment, profileReportsContextMenuConf, reportsService) {

  $scope.collectionBrowser = reportsService.collectionBrowser.byUser;
  $scope.profileReportsContextMenuConf = profileReportsContextMenuConf;

  $scope.$watch('apiData.profileUser', function(newUser) {
    if (newUser) { $scope.userSince = $moment.duration($moment(new Date()).diff($moment(newUser.registration_date))).humanize(); }
  });
};

ProfileController.$inject = ['$scope', '$moment', 'profileReportsContextMenuConf', 'reportsService'];
angular.module('appModule').controller('ProfileController', ProfileController);