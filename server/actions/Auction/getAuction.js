var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve) {

			if (action.req.query.userId) {
				resolve({ subscribers: { '$in': [action.req.query.userId] } });

			} else if (action.req.query.itemId) {
				resolve({ itemId: action.req.query.itemId });

			} else { return next(); }

		}).then(function(query) {

			new r.Promise(function(resolve) {

				r.Auction.count(query, function(err, count) {

					if (!err) {

						r.Auction
						.find(query)
						.skip(Number(action.req.query.skip))
						.limit(global.app.get('AUCTIONS_MAX_GET'))
						.sort(action.req.query.sort)
						.exec(function(err, auctions) {

							if (!err && auctions) {
								resolve({ meta: { count: count }, collection: auctions });

							} else { action.end(400, err); }
						});

					} else { action.end(400, err); }
				});

			}).then(function(data) {

				new r.Promise(function(resolve) {

					if (action.req.query.userId) {

						var itemIds = [];
						for (var i in data.collection) { itemIds.push(data.collection[i].itemId); }

						r.Item.find({ _id: { '$in': itemIds } }, function(err, items) {

							if (!err && items) {

								r.User.findOne({ _id: action.req.query.userId }, function(err, user) {

									if (!err && user) {

										data.meta.user = user;
										data.items = items;
										resolve(data);

									} else { action.end(400, err); }
								});

							} else { action.end(400, err); }
						});

					} else { resolve(data); }

				}).then(function(data) {

					action.end(200, data);
				});
			});
		});
	}
};