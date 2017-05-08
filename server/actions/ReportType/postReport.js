var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var err = {
			name: 'ValidationError',
			message: 'report_type validation failed',
			errors: {}
		};

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve) {

			if (!req.body.reportTypeId) { err.errors.reportTypeId = { kind: 'required' }; }
			if (!req.body.reportMessage) { err.errors.reportMessage = { kind: 'required' }; }

			if (Object.keys(err.errors).length > 0) {
				action.end(400, err);

			} else {

				r.ReportType.findOne({ _id: req.body.reportTypeId }, function(err, reportType) {
		    		if (!err && reportType) { resolve(reportType); } else { action.end(400, err); }
		    	});
			}

		}).then(function(reportType) {

			var mail = r.modules.mailModule.create('report_msg', 'en', process.env.GMAIL_USER, {
				userId: req.decoded._doc._id,
				username: req.decoded._doc.username,
				reportTypeId: reportType.label.en,
				number: reportType.count + 1,
				reportMessage: req.body.reportMessage
			});

			r.modules.mailModule.send(mail, function(err, info) {

				if (!err) {

					reportType.count += 1;
					reportType.save();

					action.end(200, {
						msg: {
							title: req.decoded._doc.username,
							info: r.hardData[req.session.language].msgs.infos[4]
						}
					});

				} else { action.end(400, err); }
			});
		});
	}
};