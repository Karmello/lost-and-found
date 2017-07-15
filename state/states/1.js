const r = require(global.paths.server + '/requires');
r.tasks = require(global.paths.root + '/state/tasks/_tasks');

module.exports = (cb) => {

	r.tasks.data = {
		mocks: { users: [] },
		db: { users: [] },
		fs: { userImgs: [] }
	};

	let task = new r.Promise((resolve, reject) => {

		let t = r.tasks;

		// Resetting
		r.Promise.all([t.db.clear(), t.aws.emptyBuckets()]).then(() => {

			t.mock.users().then(() => {
				t.fs.readImgs().then((files) => {

					t.data.fs.userImgs = files;

					t.db.post.users().then(() => {
						r.User.find({}, function(err, users) {

							t.data.db.users = users;

							t.mock.reports().then(() => {
								t.aws.uploadAvatars().then((filenames) => {
									t.db.setAvatars(filenames).then(() => {
										t.db.post.reports().then(() => {
											resolve();
										});
									});
								});
							});
						});
					});

				}, reject);
			});
		});
	});

	task.then(() => {
		console.log('All done\n');

	}, (err) => {
		console.log(err);
		console.log('\n');
	});
};