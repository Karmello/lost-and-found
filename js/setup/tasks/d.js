const cm = require(global.paths.server + '/cm');

module.exports = (req, res, next) => {

	cm[req.query.subject].find({}, (err, docs) => {

		if (!err) {

			let tasks = [];
			for (let doc of docs) { tasks.push(doc.remove()); }

			cm.libs.Promise.all(tasks).then((results) => {
				next(200, req.query.subject + 's deleted: ' + results.length);

			}, () => { next(400); });

		} else { next(400); }
	});
};