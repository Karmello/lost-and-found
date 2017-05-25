(function() {

	'use strict';

	var reportFormService = function($rootScope, $state, ReportsRest, Restangular) {

		var service = this;

		service.getFormSubmitAction = function(scope) {

			switch (scope.action) {

				case 'newReport':

					return function(args) {

						scope.myForm.submitSuccessCb = function(res) {
							scope.myForm.reset();
							$state.go('app.report', { id: res.data._id });
						};

						service.setModelWithGooglePlaceObj(scope);

						var modelValues = scope.myForm.model.getValues();
						modelValues.userId = $rootScope.apiData.loggedInUser._id;
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
			}
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

		return service;
	};

	reportFormService.$inject = ['$rootScope', '$state', 'ReportsRest', 'Restangular'];
	angular.module('appModule').service('reportFormService', reportFormService);

})();