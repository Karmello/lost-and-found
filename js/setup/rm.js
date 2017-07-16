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
				res.status(200).send(req.query.subject + 's removed: ' + docs.length);

			}, () => { res.status(400).send(); });

		} else { res.status(200).send(); }
	});
};