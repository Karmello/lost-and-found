var r = require(global.paths.server + '/requires');

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		r.Report.findOne({ _id: req.params.id }, function(err, report) {

			if (err) { return action.end(400, err); }

			report.category1 = req.body.category1;
			report.category2 = req.body.category2;
			report.category3 = req.body.category3;

			report.title = req.body.title;
			report.description = req.body.description;
			report.serialNo = req.body.serialNo;

			if (req.body.photos.length > 0) {

				if (req.body.avatar) {
					report.avatar = req.body.avatar;

				} else {
					report.avatar = req.body.photos[0].filename;
				}

			} else { report.avatar = undefined; }

			report.photos = req.body.photos;
			report.startEvent = new r.ReportEvent(req.body.startEvent);



			r.actions.report.runValidation(report).then(function() {

				report.save({ validateBeforeSave: false }, function(err) {
					if (!err) { action.end(200, report); } else { action.end(400, err); }
				});

			}, function(err) {

				action.end(400, err);
			});
		});
	}
};