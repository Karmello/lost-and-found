const r = require(global.paths.server + '/requires');

const m = {
	clear: () => {

		return new r.Promise((resolve) => {

			r.Promise.all([
				r.User.remove(),
				r.AppConfig.remove(),
				r.Report.remove(),
				r.Comment.remove()
			])
			.then(() => {
				console.log('db cleared');
				resolve();
			});
		});
	}
};

module.exports = m;