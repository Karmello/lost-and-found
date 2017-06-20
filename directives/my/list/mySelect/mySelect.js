(function() {

	'use strict';

	var appModule = angular.module('appModule');



	appModule.directive('mySelect', function(jsonService) {

		return {
			restrict: 'E',
			templateUrl: 'public/templates/mySelect.html',
			scope: {
				ctrlId: '=',
				model: '=',
				collection: '=',
				nestedCollectionFieldName: '=',
				propNames: '=',
				optionZero: '=',
				hardData: '=',
				hideErrors: '='
			},
			link: function(scope, elem, attrs) {

				var parentGroup = $(elem).parents('my-selects-group').get();

				// If select is nested in mySelectGroup
				if (parentGroup.length > 0) {

					// Getting select index in parent group
					var myIndex = $($(elem).parent()[0].children).index(elem);



					/* Setting for all selects */

					// Defining onSelect event handler
					scope.onSelect = function() {

						var allSelectsCount = $(elem).parent()[0].children.length;

						// For all selects below this one
						for (var i = myIndex + 1; i < allSelectsCount; i++) {

							// Getting select scope
							var select_scope = $($($(elem).parent()[0].children[i]).find('select')[0]).scope();

							// Resetting scope variables
							select_scope.model.value.active = '';
							select_scope.collection = undefined;
						}
					};



					/* If I am not top select */

					if (myIndex > 0) {

						// Getting scope of the first select above
						var select_scope = $($($(elem).parent()[0].children[myIndex - 1]).find('select')[0]).scope();

						// Watching for its model changes
						scope.$watch(function() { return select_scope.model.value.active; }, function(newValue) {

							if (newValue) {

								// Getting collection of the first select above
								var collection = select_scope.collection;

								// Setting proper collection for myself
								jsonService.find.objectByProperty(collection, select_scope.propNames.optionValue, newValue, function(obj) {
									if (obj) { scope.collection = obj[scope.nestedCollectionFieldName]; }
								});

							} else {

								// Resetting own scope collection
								scope.collection = undefined;
							}
						});
					}



					/* Setting for select with particular index */

					switch (myIndex) {

						case 0:

							// Watching parent group collection for changes
							scope.$watch('$parent.$parent.collection', function(newValue) {
								if (newValue) {
									scope.collection = newValue;
								}
							});

							// Watching for model changes
							scope.$watch('model.value.active', function(newValue) {

								// Selecting option 1 as default, later setting model overrides this
								if (!scope.optionZero && !newValue && scope.collection) {
									scope.model.value.active = scope.collection[0][scope.propNames.optionValue];
								}
							});

							break;
					}
				}
			}
		};
	});

})();