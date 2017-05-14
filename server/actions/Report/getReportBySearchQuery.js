var r = require(global.paths._requires);

module.exports = function(req, res, next) {

	var action = new r.prototypes.Action(arguments);
	var query = {};

	new r.Promise(function(resolve, reject) {

		if (action.req.query.filter != 'all') { query.group = action.req.query.filter; }
		if (action.req.query.title) { query.title = { '$regex': action.req.query.title, '$options': 'i' }; }
		if (action.req.query.categoryId) { query.categoryId = action.req.query.categoryId; }
		if (action.req.query.subcategoryId) { query.subcategoryId = action.req.query.subcategoryId; }

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