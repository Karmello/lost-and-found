const cm = require(global.paths.server + '/cm');

let run = (subject) => {

	return new cm.libs.Promise((resolve, reject) => {

		let s = cm.setup;
		s.subject = subject;

		s.dbClient.get()
		.then(s.dataFactory.prepare)
		.then(s.dbClient.post)
		.then(s.fileReader.readImgs)
		.then(s.awsUploader.uploadImgs)
		.then(s.dbClient.sync)
		.then(() => {

			r[subject].count((err, count) => {
				if (!err) { resolve(count); } else { reject(err); }
			});

		}, reject);
	});
};

module.exports = (req, res, next) => {

	run(req.query.subject).then((count) => {
		next(200, req.query.subject + 's created: ' + count);

	}, (err) => {
		next(400, err);
	});
};