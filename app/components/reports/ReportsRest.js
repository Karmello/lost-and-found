var ReportsRest = function($rootScope, Restangular, MyFormModel) {

  var getReportEventModelConf = function() {
    return {
      type: {},
      date: {},
      placeId: {},
      address: {},
      lat: {},
      lng: {},
      details: {}
    };
  };

  var getReportModelConf = function() {
    return {
      category1: {},
      category2: {},
      category3: {},
      title: {},
      serialNo: {},
      description: {},
      startEvent: getReportEventModelConf()
    };
  };

  var reports = Restangular.service('reports');

  reports.addReportModel = new MyFormModel(getReportModelConf());
  reports.editReportModel = new MyFormModel(getReportModelConf());
  reports.respondToReportModel = new MyFormModel(getReportEventModelConf());

  reports.reportSearchModel = new MyFormModel({
    title: {},
    category1: {},
    category2: {},
    category3: {}
  });

  Restangular.extendModel('reports', function(report) {

    report._isOwn = function() {

      if ($rootScope.apiData.loggedInUser) {
        return this.userId == $rootScope.apiData.loggedInUser._id;
      }
    };

    report.getFullCategory = function() {

      var category1, category2, category3;
      var labels = [];

      if (report.category1) {

        category1 = _.find($rootScope.hardData.reportCategories, function(obj) {
          return obj._id == report.category1;
        });

        labels.push(category1.label);
      }

      if (report.category2) {

        category2 = _.find(category1.subcategories, function(obj) {
          return obj._id == report.category2;
        });

        labels.push(category2.label);
      }

      if (report.category3) {

        category3 = _.find(category2.subcategories, function(obj) {
          return obj._id == report.category3;
        });

        labels.push(category3.label);
      }

      return labels.join(' / ');
    };

    return report;
  });

  return reports;
};

ReportsRest.$inject = ['$rootScope', 'Restangular', 'MyFormModel'];
angular.module('appModule').factory('ReportsRest', ReportsRest);