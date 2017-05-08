(function() {

	'use strict';

	var appModule = angular.module('appModule');

	appModule.directive('singleFileInput', function() {

		var singleFileInput = {
			restrict: 'E',
			template: '<input id="singleFileInput" name="file" type="file" />',
			scope: true,
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var singleFileInput = $(elem).find('#singleFileInput').get()[0];
					var onChangeCb;

					scope.$on('displaySingleFileInput', function(e, args) {
						onChangeCb = args.cb;
						$(singleFileInput).val(undefined);
						$(singleFileInput).click();
					});

					$(singleFileInput).on('change', function(e) {
						if (e.target.files.length > 0) { onChangeCb(e.target.files); }
					});
				};
			}
		};

		return singleFileInput;
	});

	appModule.directive('multipleFilesInput', function() {

		var multipleFilesInput = {
			restrict: 'E',
			template: '<input id="multipleFilesInput" name="file" type="file" multiple />',
			scope: true,
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					var multipleFilesInput = $(elem).find('#multipleFilesInput').get()[0];
					var onChangeCb;

					scope.$on('displayMultipleFilesInput', function(e, args) {
						onChangeCb = args.cb;
						$(multipleFilesInput).val(undefined);
						$(multipleFilesInput).click();
					});

					$(multipleFilesInput).on('change', function(e) {
						if (e.target.files.length > 0) { onChangeCb(e.target.files); }
					});
				};
			}
		};

		return multipleFilesInput;
	});

})();