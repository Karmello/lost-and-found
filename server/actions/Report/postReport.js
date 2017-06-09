var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		var report = new r.Report({
			userId: req.decoded._id,
			category1: req.body.category1,
			category2: req.body.category2,
			category3: req.body.category3,
			title: req.body.title,
			description: req.body.description,
			serialNo: req.body.serialNo
		});

		report.startEvent = new r.ReportEvent(req.body.startEvent);



		r.actions.report.runValidation(report).then(function () {

			report.save({ validateBeforeSave: false }, function(err) {

				if (!err) {
					r.modules.socketModule.emitReportsCount(report.startEvent.type);
					action.end(201, report);

				} else { action.end(400, err); }
			});

		}, function(err) {
			action.end(400, err);
		});
	}
};