var r = require(global.paths._requires);

module.exports = function(report) {

	return new r.Promise(function(resolve, reject) {

		report.validate(function(err1) {

			report.startEvent.validate(function(err2) {

				if (!err1 && !err2) {
					resolve();

				} else {

					var err = { name: 'ValidationError', errors: {} };

					if (err1) {
						Object.assign(err.errors, err1.errors);
					}

					if (err2) {
						err.errors.startEvent = {};
						Object.assign(err.errors.startEvent, err2.errors);
					}

					reject(err);
				}
			});
		});
	});
};