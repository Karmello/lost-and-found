const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);
	let tasks = [];

	tasks.push(cm.User.findOne({ _id: action.req.decoded._id }));
	tasks.push(cm.Report.findOne({ _id: action.req.query._id }));

	cm.libs.Promise.all(tasks).then((data) => {

		let user = data[0];
		let report = data[1];

		if (user.reportsRecentlyViewed.indexOf(report._id) === -1) {
			if (user.reportsRecentlyViewed.length === cm.app.get('USER_RECENTLY_VIEWED_REPORTS_MAX_LENGTH')) { user.reportsRecentlyViewed.shift(); }
			user.reportsRecentlyViewed.push(report._id);
		}

		user.save({ validateBeforeSave: false }, (err) => {

			if (!err) {
				action.end(200, {
					report: report,
					reportsRecentlyViewed: user.reportsRecentlyViewed
				});

			} else { action.end(400, err); }
		});

	}, (err) => { action.end(400, err); });
};