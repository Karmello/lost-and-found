(function() {

	'use strict';

	var reportFormService = function($rootScope, $state, $timeout, ReportsRest, Restangular, MyForm) {

		var service = this;

		var getFormSubmitAction = function(scope) {

			switch (scope.action) {

				case 'addReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {
							scope.myForm.reset();
							$state.go('app.report', { id: res.data._id });
						};

						service.setModelWithGooglePlaceObj(scope);

						var modelValues = scope.myForm.model.getValues();
						return ReportsRest.post(modelValues);
					};

				case 'editReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {

							$rootScope.apiData.report = res.data;
							$state.go('app.report', { id: res.data._id, edit: undefined });
						};

						scope.myForm.submitErrorCb = function(res) {
							$rootScope.apiData.report = copy;
						};

						service.setModelWithGooglePlaceObj(scope);

						var copy = Restangular.copy($rootScope.apiData.report);
						scope.myForm.model.assignTo(copy);
						return copy.put();
					};

				case 'respondToReport':

					return function(args) {


					};
			}
		};



		service.createFormIns = function(scope) {

			service[scope.action + 'Form'] = new MyForm({
				ctrlId: scope.action + 'Form',
				model: ReportsRest[scope.action + 'Model'],
				submitAction: getFormSubmitAction(scope),
				onCancel: function() {

					if (scope.action != 'respondToReport') {
						$timeout(function() { scope.myForm.reset(); });
						window.history.back();

					} else {
						$rootScope.$broadcast('toggleRespondToReportForm', { visible: false });
					}
				}
			});

			return service[scope.action + 'Form'];
		};

		service.setModelWithGooglePlaceObj = function(scope) {

			var place = scope.autocomplete.ins.getPlace();

			if (place) {
				scope.myForm.model.set({
					startEvent: {
						geolocation: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
						placeId: place.place_id
					}
				});

			} else {
				scope.myForm.model.setValue('startEvent.geolocation', undefined);
			}
		};

		service.setMaxDate = function(scope) {

			var date = new Date();
			scope.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
		};

		return service;
	};

	reportFormService.$inject = ['$rootScope', '$state', '$timeout', 'ReportsRest', 'Restangular', 'MyForm'];
	angular.module('appModule').service('reportFormService', reportFormService);

})();