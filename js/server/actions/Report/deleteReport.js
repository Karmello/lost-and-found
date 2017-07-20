const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);

	cm.Report.findOne({ _id: action.req.params.id }, (err, report) => {

		if (!err && report) {
			if (action.req.decoded._id == report.userId) {

				report.remove((err) => {
					if (!err) { action.end(204); } else { action.end(400, err); }
				});

			} else { action.end(400, 'REPORT_DELETE_NOT_ALLOWED'); }

		} else { action.end(400, err); }
	});
};