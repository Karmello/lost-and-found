const r = require(global.paths.server + '/requires');

module.exports = (req, res, next) => {

	r[req.query.subject].find({}, (err, docs) => {

		if (!err) {

			let tasks = [];
			for (let doc of docs) { tasks.push(doc.remove()); }

			r.Promise.all(tasks).then((results) => {
				next(200, req.query.subject + 's deleted: ' + results.length);

			}, () => { next(400); });

		} else { next(400); }
	});
};