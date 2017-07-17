const r = require(global.paths.server + '/requires');

module.exports = (req, res, next) => {

	r[req.query.subject].find({}, (err, docs) => {

		if (!err) {

			let tasks = [];

			for (let doc of docs) {
				tasks.push(new r.Promise((resolve, reject) => {
					doc.remove((err) => {
						if (!err) { resolve(); } else { reject(err); }
 					});
				}));
			}

			r.Promise.all(tasks).then(() => {
				next(200, req.query.subject + 's deleted: ' + docs.length);

			}, () => { next(400); });

		} else { next(400); }
	});
};