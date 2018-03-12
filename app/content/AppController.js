var AppController = function(
  $rootScope, $scope, $window, $state, Restangular,
  storageService, authService, hardDataService, uiSetupService, ui, apiData, localData, NUMS
) {

  $rootScope.Math = window.Math;
  $rootScope.apiData = apiData;
  $rootScope.localData = localData;
  $rootScope.ui = ui;
  $rootScope.hardData = hardDataService.get();
  $rootScope.NUMS = NUMS;
  $rootScope.logout = authService.logout;
  
  $rootScope.$watch(function() { return storageService.authToken.getValue(); }, function(newValue) {

    Restangular.setDefaultHeaders({ 'x-access-token': newValue });
    
    // When token is gone but user still logged in then the app will reload
    if (!newValue && authService.state.loggedIn) { $window.location.reload(); }
  });
};

AppController.$inject = [
  '$rootScope', '$scope', '$window', '$state', 'Restangular',
  'storageService', 'authService', 'hardDataService', 'uiSetupService', 'ui', 'apiData', 'localData', 'NUMS'
];

angular.module('appModule').controller('AppController', AppController);