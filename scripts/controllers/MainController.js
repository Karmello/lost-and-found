(function() {

	'use strict';

	var MainController = function($rootScope, $scope, MyDataModel, ReportsRest) {

		$rootScope.runTest = function() {

			var reportModel = new MyDataModel(ReportsRest.myDataModel);
			console.log(reportModel.set($rootScope.apiData.report.plain()));
		};
	};

	MainController.$inject = ['$rootScope', '$scope', 'MyDataModel', 'ReportsRest'];
	angular.module('appModule').controller('MainController', MainController);

})();