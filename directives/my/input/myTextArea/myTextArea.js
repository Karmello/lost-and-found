(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('myTextArea', function() {

		var myTextArea = {
			restrict: 'E',
			templateUrl: 'public/directives/my/input/myTextArea/myTextArea.html',
			scope: {
				ctrlId: '=',
				ctrlMaxLength: '=',
				model: '=',
				autoResizable: '<',
				hardData: '='
			},
			controller: function($scope) {},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					if (scope.autoResizable) {

						var textarea = $(elem).find('textarea').get()[0];
						$(textarea).css('overflow', 'hidden');

						scope.resize = function() {
							$(textarea).css('height', 'auto');
							$(textarea).css('height', $(textarea).prop('scrollHeight') + 4 +'px');
						};
					}
				};
			}
		};

		return myTextArea;
	});

})();