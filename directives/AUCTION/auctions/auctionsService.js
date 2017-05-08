(function() {

	'use strict';

	var auctionsService = function($rootScope, $q) {

		this.deleteAuctions = function(auctions) {

			if (auctions && auctions.length > 0) {

				var promises = [];

				for (var auction of auctions) {
					promises.push(auction.remove());
				}

				$q.all(promises).then(function(results) {
					$rootScope.$broadcast('initItemAuctions');
				});
			}
		};

		this.placeBid = function() {};

		return this;
	};

	auctionsService.$inject = ['$rootScope', '$q'];
	angular.module('appModule').service('auctionsService', auctionsService);

})();