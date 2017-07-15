const r = require(global.paths.server + '/requires');

module.exports = (cb) => {

	r.User.remove({}, () => {
		r.AppConfig.remove(() => {
			cb();
		});
	});
};