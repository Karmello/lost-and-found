const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);

	new cm.libs.Promise((resolve, reject) => {

		// Getting report owner
		if (action.req.query.reportId) {

			cm.Report.findOne({ _id: action.req.query.reportId }, (err, report) => {

				if (!err && report) {
					resolve({ query: { _id: report.userId } });

				} else { reject(err); }
			});

		// Getting user by id
		} else {

			resolve({
				query: { _id: action.req.query._id },
				select: action.req.decoded._id !== action.req.query._id ? '-paymentId' : undefined
			});
		}

	}).then((params) => {

		cm.User.findOne(params.query, params.select, (err, user) => {
			if (!err && user) { action.end(200, [user]); } else { action.end(400, err); }
		});

	}, (err) => { action.end(400, err); });
};