(function() {

	'use strict';

	var reportsService = function($rootScope, $state, $stateParams, $timeout, $q, reportsConf, ReportsRest) {

		var service = this;

		service.formModelFields = [
			'group',
			'categoryId',
			'subcategoryId',
			'title',
			'serialNo',
			'description',
			'date',
			'geolocation',
			'details'
		];

		service.getFormSubmitAction = function(scope) {

			switch (scope.action) {

				case 'newReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {
							scope.myForm.reset();
							$state.go('app.report', { id: res.data._id });
						};

						var modelValues = scope.myModel.getValues();
						modelValues.userId = $rootScope.globalFormModels.personalDetailsModel.getValue('_id');

						var place = scope.autocomplete.ins.getPlace();

						if (place) {

							modelValues.geolocation = {
								lat: place.geometry.location.lat(),
								lng: place.geometry.location.lng()
							};

							modelValues.placeId = place.place_id;

						} else {
							modelValues.geolocation = null;
						}

						return ReportsRest.post(modelValues);
					};

				case 'editReport':

					return function(args) {

						$scope.myForm.submitSuccessCb = function(res) {
							$rootScope.apiData.report = res.data;
							$state.go('app.report', { id: res.data._id, edit: undefined });
						};

						$scope.myForm.submitErrorCb = function(res) {
							$rootScope.apiData.report = copy;
						};

						var copy = Restangular.copy($rootScope.apiData.report);
						$scope.myModel.setRestObj(copy);
						return copy.put();
					};
			}
		};

		service.getAutoCompleteObj = function(scope) {

			return {
				onPlaceChanged: function() {

					var place = scope.autocomplete.ins.getPlace();

					if (place) {
						scope.autocomplete.icon = place.icon;
						scope.autocomplete.label = place.formatted_address;
						scope.$apply();
					}
				}
			};
		};

		service.deleteReports = function(reports) {

			if (reports && reports.length > 0) {

				// Showing confirm modal
				$rootScope.ui.modals.deleteReportModal.show({
					message: (function() { return $rootScope.hardData.warnings[2]; })(),
					acceptCb: function() {

						var promises = [];
						for (var report of reports) { promises.push(report.remove({ userId: report.userId })); }

						$q.all(promises).then(function(results) {

							switch ($state.current.name) {

								case 'app.profile':
									$rootScope.$broadcast('initUserReports', { userId: $stateParams.id });
									break;

								case 'app.report':
									window.history.back();
									break;
							}
						});
					}
				});
			}
		};

		service.initUserReports = function(scope, userId) {

			scope.collectionBrowser = reportsConf.profileCollectionBrowser;

			if (userId == $rootScope.apiData.loggedInUser._id) {
				scope.elemContextMenuConf = scope.reportContextMenuConf;

			} else {
				$scope.elemContextMenuConf = undefined;
			}

			scope.collectionBrowser.onRefreshClick();
		};

		return service;
	};



	reportsService.$inject = ['$rootScope', '$state', '$stateParams', '$timeout', '$q', 'reportsConf', 'ReportsRest'];
	angular.module('appModule').service('reportsService', reportsService);

})();