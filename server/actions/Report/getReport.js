var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		// Getting single report
		if (req.query._id) {

			return r.Report.findOne({ _id: req.query._id }, function(err, report) {

				if (!err && report) {
					res.status(200).send([report]);

				} else { res.status(400).send(err); }
			});

		// Getting multiple reports
		} else {

			var action = new r.prototypes.Action(arguments);
			var query = {};

			try {

				if (action.req.query.filter != 'all') { query.group = action.req.query.filter; }

				if (action.req.query.userId) {
					query.userId = action.req.query.userId;

				} else {

					if (action.req.query.title) { query.title = { '$regex': action.req.query.title, '$options': 'i' }; }
					if (action.req.query.categoryId) { query.categoryId = action.req.query.categoryId; }
					if (action.req.query.subcategoryId) { query.subcategoryId = action.req.query.subcategoryId; }
				}

				// Getting requested reports count
				r.Report.count(query, function(err, count) {

					if (!err) {

						// Getting reports
						r.Report.find(query)
						.skip(Number(req.query.skip))
						.limit(global.app.get('REPORTS_MAX_GET'))
						.sort(req.query.sort)
						.exec(function(err, reports) {

							if (!err && reports) {

								action.end(200, {
									meta: { count: count },
									collection: reports
								});

							} else { action.end(400, err); }
						});

					} else { action.end(400, err); }
				});

			} catch(ex) { action.end(500, ex); }
		}
	}
};