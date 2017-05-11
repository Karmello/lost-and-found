var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		// Getting single item
		if (req.query._id) {

			return r.Item.findOne({ _id: req.query._id }, function(err, item) {

				if (!err && item) {
					res.status(200).send([item]);

				} else { res.status(400).send(err); }
			});

		// Getting multiple items
		} else {

			var action = new r.prototypes.Action(arguments);
			var query = {};

			try {

				if (action.req.query.filter != 'all') { query.typeId = action.req.query.filter; }

				if (action.req.query.userId) {
					query.userId = action.req.query.userId;

				} else {

					if (action.req.query.title) { query.title = { '$regex': action.req.query.title, '$options': 'i' }; }
					if (action.req.query.categoryId) { query.categoryId = action.req.query.categoryId; }
					if (action.req.query.subcategoryId) { query.subcategoryId = action.req.query.subcategoryId; }
				}

				// Getting requested items count
				r.Item.count(query, function(err, count) {

					if (!err) {

						// Getting items
						r.Item.find(query)
						.skip(Number(req.query.skip))
						.limit(global.app.get('ITEMS_MAX_GET'))
						.sort(req.query.sort)
						.exec(function(err, items) {

							if (!err && items) {

								action.end(200, {
									meta: { count: count },
									collection: items
								});

							} else { action.end(400, err); }
						});

					} else { action.end(400, err); }
				});

			} catch(ex) { action.end(500, ex); }
		}
	}
};