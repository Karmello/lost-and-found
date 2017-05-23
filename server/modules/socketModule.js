var r = require(global.paths._requires);

module.exports = {
	emitUsersCount: function() {

		r.User.count({}, function(err, usersCount) {

			if (!err) {
				r.io.emit('UpdateAppStats', { usersCount: usersCount });
			}
		});
	},
	emitReportsCount: function(group) {

		r.Report.count({}, function(err1, reportsCount) {
			r.Report.count({ 'startEvent.group': group }, function(err2, groupReportsCount) {

				if (!err1 && !err2) {
					var data = { reportsCount: reportsCount };
					data[group + 'ReportsCount'] = groupReportsCount;
					r.io.emit('UpdateAppStats', data);
				}
			});
		});
	}
};