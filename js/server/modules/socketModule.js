var r = require(global.paths._requires);

module.exports = {
	emitUsersCount: function() {

		r.User.count({}, function(err, usersCount) {

			if (!err) {
				r.io.emit('UpdateAppStats', { usersCount: usersCount });
			}
		});
	},
	emitReportsCount: function(type) {

		r.Report.count({}, function(err1, reportsCount) {
			r.Report.count({ 'startEvent.type': type }, function(err2, typeReportsCount) {

				if (!err1 && !err2) {
					var data = { reportsCount: reportsCount };
					data[type + 'ReportsCount'] = typeReportsCount;
					r.io.emit('UpdateAppStats', data);
				}
			});
		});
	}
};