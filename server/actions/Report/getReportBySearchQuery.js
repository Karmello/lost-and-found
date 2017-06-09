var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	var query = {};

	new r.Promise(function(resolve, reject) {

		if (action.req.query.filter && action.req.query.filter != 'all') { query['startEvent.type'] = action.req.query.filter; }
		if (action.req.query.title) { query.title = { '$regex': action.req.query.title, '$options': 'i' }; }
		if (action.req.query.category1) { query.category1 = action.req.query.category1; }
		if (action.req.query.category2) { query.category2 = action.req.query.category2; }
		if (action.req.query.category3) { query.category3 = action.req.query.category3; }
		if (action.req.query.userId) { query.userId = action.req.query.userId; }

		// Getting requested reports count
		r.Report.count(query, function(err, count) {

			if (!err) {

				// Getting reports
				r.Report.find(query)
				.skip(Number(req.query.skip))
				.limit(Number(req.query.limit) || global.app.get('REPORTS_MAX_GET'))
				.sort(req.query.sort)
				.exec(function(err, reports) {

					if (!err && reports) {
						resolve({
							meta: { count: count },
							collection: reports
						});

					} else { reject(err); }
				});

			} else { reject(err); }
		});

	}).then(function(data) {

		action.end(200, data);

	}, function(err) {

		action.end(400, err);
	});
};