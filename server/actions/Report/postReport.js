var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		var report = new r.Report({
			userId: req.decoded._id,
			categoryId: req.body.categoryId,
			subcategoryId: req.body.subcategoryId,
			title: req.body.title,
			description: req.body.description,
			serialNo: req.body.serialNo
		});

		report.startEvent = new r.ReportEvent(req.body.startEvent);



		r.actions.report.runValidation(report).then(function () {

			report.save({ validateBeforeSave: false }, function(err) {

				if (!err) {
					r.modules.socketModule.emitReportsCount(report.startEvent.group);
					action.end(201, report);

				} else { action.end(400, err); }
			});

		}, function(err) {
			action.end(400, err);
		});
	}
};