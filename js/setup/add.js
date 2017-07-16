const r = require(global.paths.server + '/requires');

module.exports = (req, res, next) => {

	let createCollectionTask = (collectionName) => {

		let modelName, imgSubject;

		switch (collectionName) {

			case 'users':
				modelName = 'User';
				imgSubject = 'user_avatar';
				break;

			case 'reports':
				modelName = 'Report';
				imgSubject = 'report_photos';
				break;
		}

		return () => {

			return new r.Promise((resolve, reject) => {

				t.mock[collectionName]().then(() => {
					t.db.post[collectionName]().then(() => {
						r[modelName].find({}, (err, collection) => {

							if (!err) {
								t.data.db[collectionName] = collection;

								t.fs['read' + modelName + 'Imgs']().then((files) => {
									t.aws.uploadImgs(imgSubject, files).then((files) => {
										t.db.updateFileNames(imgSubject, files).then(resolve, reject);
									}, reject);

								}, reject);

							} else { reject(err); }
						});
					}, reject);
				}, reject);
			});
		};
	};

	let t = r.tasks;

	t.data = {
		mocks: { users: [] },
		db: { users: [] },
		fs: { userImgs: [] }
	};

	let task = new r.Promise((resolve, reject) => {

		r.Promise.all([t.db.clear(), t.aws.emptyBuckets()]).then(() => {

			let usersTask = createCollectionTask('users');
			let reportsTask = createCollectionTask('reports');

			usersTask().then(() => {
				reportsTask().then(resolve, reject);
			}, reject);
		});
	});

	task.then(() => {
		res.status(200).send('All done');

	}, (err) => {
		console.log(err);
		console.log('\n');
	});
};