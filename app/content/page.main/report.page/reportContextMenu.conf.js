var reportContextMenuConf = function($rootScope, $state, reportsService) {
  return {
    icon: 'glyphicon glyphicon-option-horizontal',
    switchers: [
      {
        _id: 'edit',
        label: $rootScope.hardData.imperatives[33],
        onClick: function() { $state.go('app.report', { id: this.parent.data._id, edit: '1' }); }
      },
      {
        _id: 'delete',
        label: $rootScope.hardData.imperatives[14],
        onClick: function() { reportsService.deleteReports([this.parent.data]); }
      }
    ]
  };
};

reportContextMenuConf.$inject = ['$rootScope', '$state', 'reportsService'];
angular.module('appModule').service('reportContextMenuConf', reportContextMenuConf);