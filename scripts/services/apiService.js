(function() {

	'use strict';

	var apiService = function(
		$rootScope, $window, $timeout, $moment, storageService, itemsConf, auctionsConf, commentsConf, Restangular
	) {

		var service = {
			setup: function() {

				Restangular.setBaseUrl('/api');
				Restangular.setFullResponse(true);
				Restangular.setRestangularFields({ id: '_id' });
				Restangular.addResponseInterceptor(service.interceptResponse);

				Restangular.addElementTransformer('users', false, function(user) {

					if (user.username) {
						user.truncatedUsername = user.username.truncate(15);
						user.formattedRegistrationDate = $moment(user.registration_date).format('DD-MM-YYYY HH:mm');
						user.countryFirstLetter = user.country[0];

					} else if (user.user) {
						user.user.truncatedUsername = user.user.username.truncate(15);
						user.user.formattedRegistrationDate = $moment(user.user.registration_date).format('DD-MM-YYYY HH:mm');
						user.user.countryFirstLetter = user.user.country[0];
					}

					return user;
				});

				Restangular.addElementTransformer('items', false, function(item) {
					item.truncatedTitle = item.title.truncate(25);
					item.date = new Date(item.date);
					item.formattedDateAdded = $moment(item.dateAdded).format('DD-MM-YYYY HH:mm');
					item.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(item.dateAdded))).humanize();
					service.createItemFullCategoryString(item);
					return item;
				});

				Restangular.addElementTransformer('auctions', false, function(auction) {
					auction.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(auction.dateAdded))).humanize();
					auction.formattedDateAdded = $moment(auction.dateAdded).format('DD-MM-YYYY HH:mm');
					return auction;
				});

				Restangular.addElementTransformer('comments', false, function(comment) {
					comment.pastSinceAdded = $moment.duration($moment(new Date()).diff($moment(comment.dateAdded))).humanize();
					return comment;
				});
			},
			interceptResponse: function(data, operation, what, url, res, deferred) {

				if (data.authToken) { storageService.authToken.setValue(data.authToken); }

				if (data.msg) {
					$timeout(function() {
						var body = { title: data.msg.title, message: data.msg.info };
						if (data.msg.reload) { body.hideCb = function() { $window.location.reload(); }; }
						$rootScope.ui.modals.infoModal.show(body);
					}, 100);
				}



				var i;

				switch (what) {

					case 'app_configs':

						var appConfig = Restangular.restangularizeElement(undefined, data.appConfig, 'app_configs');
						$rootScope.apiData.loggedInUser.appConfig = appConfig;
						break;

					case 'users':

						switch (operation) {

							case 'getList':

								if (res.config.params) {

									if (res.config.params._id) {
										$rootScope.apiData.profileUser = data[0];

									} else if (res.config.params.itemId) {
										$rootScope.apiData.itemUser = data[0];
									}
								}

								break;

							case 'post':

								data.user.appConfig = data.appConfig;
								$rootScope.apiData.loggedInUser = data.user;
								Restangular.restangularizeElement(undefined, $rootScope.apiData.loggedInUser.appConfig, 'app_configs');
								return Restangular.restangularizeCollection(undefined, [data.user], 'users');

							case 'put':

								$rootScope.apiData.loggedInUser = data.user;
								return data.user;
						}

						break;

					case 'items':

						switch (operation) {

							case 'getList':

								if (res.config.params) {

									if (res.config.params._id) {

										if (!$rootScope.apiData.item) {
											$rootScope.apiData.item = data[0];
										}

										return data;

									} else if (res.config.params.userId) {

										itemsConf.profileCollectionBrowser.setData(data);
										return data.collection;

									} else {
										itemsConf.searchCollectionBrowser.setData(data);
										return data.collection;
									}
								}

								break;

							case 'put':

								return data;
						}

						break;

					case 'auctions':

						switch (operation) {

							case 'getList':

								if (res.config.params.userId) {
									for (i in data.collection) { data.collection[i].item = data.items[i]; }
									auctionsConf.userAuctionsBrowser.setData(data);

								} else if (res.config.params.itemId) {
									auctionsConf.itemAuctionsBrowser.setData(data);

								} else {
									$rootScope.apiData.auction = data[0];
								}

								return data.collection;
						}

						break;

					case 'comments':

						switch (operation) {

							case 'getList':

								for (i in data.collection) { data.collection[i].user = data.users[i]; }
								commentsConf.itemCommentsBrowser.setData(data);
								break;
						}

						return data.collection;
				}

				return data;
			},
			createItemFullCategoryString: function(item) {

				var category = _.find($rootScope.apiData.itemCategories, function(obj) {
					return obj._id == item.categoryId;
				});

				var subcategory = _.find(category.subcategories, function(obj) {
					return obj._id == item.subcategoryId;
				});

				item.fullCategory = category.label + ' / ' + subcategory.label;
			}
		};

		return service;
	};

	apiService.$inject = [
		'$rootScope', '$window', '$timeout', '$moment', 'storageService', 'itemsConf', 'auctionsConf', 'commentsConf',
		'Restangular'
	];

	angular.module('appModule').service('apiService', apiService);

})();