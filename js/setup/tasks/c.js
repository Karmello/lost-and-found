const r = require(global.paths.server + '/requires');

let run = (subject) => {

	return new r.Promise((resolve, reject) => {

		new r.Promise((resolve) => {

			if (subject !== 'User') {
				r.User.find({}, (err, users) => {
					if (!err) { resolve(users); } else { reject(err); }
				});

			} else { resolve(); }

		}).then((users) => {

			// Preparing data
			r.setup.dataFactory['prepare' + subject + 's'](users).then((data) => {

				// Populating db collection
				r.setup.dbClient.post(subject, data).then(() => {

					new r.Promise((resolve) => {

						if (subject !== 'Comment') {

							// Reading imgs from fs
							r.setup.fileReader['read' + subject + 'Imgs'](data).then((files) => {

								// Uploading imgs to S3
								r.setup.awsUploader.uploadImgs(subject.toLowerCase() + '_photo', files).then((files) => {

									// Updating filenames in db
									r.setup.dbClient.updateFileNames(subject.toLowerCase() + '_photo', files).then(resolve, reject);

								}, reject);
							}, reject);

						} else { resolve(); }

					}).then(() => {

						// Counting docs in db
						r[subject].count((err, count) => {

							// Finishing
							if (!err) { resolve(count); } else { reject(err); }
						});
					});

				}, reject);
			}, reject);
		});
	});
};

module.exports = (req, res, next) => {

	run(req.query.subject).then((count) => {
		next(200, req.query.subject + 's created: ' + count);

	}, (err) => {
		next(400, err);
	});
};