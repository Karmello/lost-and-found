const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

	let action = new cm.prototypes.Action(args);

	let report = new cm.Report({
		userId: action.req.decoded._id,
		category1: action.req.body.category1,
		category2: action.req.body.category2,
		category3: action.req.body.category3,
		title: action.req.body.title,
		description: action.req.body.description,
		serialNo: action.req.body.serialNo
	});

	if (action.req.body._id) { report._id = action.req.body._id; }
	report.startEvent = new cm.ReportEvent(action.req.body.startEvent);

	cm.actions.report.runValidation(report).then(() => {

		report.save({ validateBeforeSave: false }, (err) => {

			if (!err) {
				cm.Report.emitReportsCount(report.startEvent.type);
				action.end(201, report);

			} else { action.end(400, err); }
		});

	}, (err) => { action.end(400, err); });
};