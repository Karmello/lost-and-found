const r = require(global.paths.server + '/requires');

let createCollectionTask = (subject) => {

	return () => {

		return new r.Promise((resolve, reject) => {

			let collectionName = subject.toLowerCase() + 's';

			t.mock[collectionName]().then(() => {
				t.db.post[collectionName]().then(() => {
					r[subject].find({}, (err, collection) => {

						if (!err) {
							t.data.db[collectionName] = collection;

							t.fs['read' + subject + 'Imgs']().then((files) => {
								t.aws.uploadImgs(subject.toLowerCase() + '_photo', files).then((files) => {
									t.db.updateFileNames(subject.toLowerCase() + '_photo', files).then(resolve, reject);
								}, reject);

							}, reject);

						} else { reject(err); }
					});
				}, reject);
			}, reject);
		});
	};
};

let t = r.setup;

t.data = {
	mocks: { users: [], reports: [] },
	db: { users: [], reports: [] },
	fs: { userImgs: [], reportImgs: [] }
};



module.exports = (req, res, next) => {

	let task = createCollectionTask(req.query.subject);

	task().then(() => {
		next(200, req.query.subject + 's created: ' + t.data.db.users.length);

	}, () => {
		next(400, err);
	});
};