(function() {

	'use strict';

	var appModule = angular.module('appModule');

	var subscribers;

	appModule.directive('auctionSubscribersWindow', function($rootScope, $state, MySrcCollection, UsersRest, URLS) {
		return {
			restrict: 'E',
			templateUrl: 'public/directives/AUCTION/auctionSubscribersWindow/auctionSubscribersWindow.html',
			scope: {
				myModal: '='
			},
			controller: function($scope) {

				$scope.hardData = $rootScope.hardData;

				$scope.srcCollection = new MySrcCollection({
					constructUrl: function(i) {
						return URLS.AWS3_RESIZED_UPLOADS_BUCKET_URL + 'resized-' + subscribers[i]._id + '/' + subscribers[i].photos[0].filename;
					}
				});
			},
			compile: function(elem, attrs) {

				return function(scope, elem, attrs) {

					$rootScope.$on('auctionSubscribersWindowOpen', function() {

						var onSingleSrcClick = function() {

							var that = this;

							$rootScope.ui.modals.auctionSubscribersModal.hide(function() {
								$state.go('main.profile', { id: that._id });
							});
						};

						UsersRest.getList({ auctionId: $rootScope.apiData.auction._id }).then(function(res) {

							subscribers = res.data.plain();

							scope.srcCollection.init(subscribers, function() {
								for (var i in scope.srcCollection.collection) {
									scope.srcCollection.collection[i].onClick = onSingleSrcClick;
									scope.srcCollection.collection[i].label = subscribers[i].username;
								}
							});

						}, function(res) {});
					});

					scope.onRefreshBtnClick = function() {
						$rootScope.$broadcast('auctionSubscribersWindowOpen');
					};
				};
			}
		};
	});

})();