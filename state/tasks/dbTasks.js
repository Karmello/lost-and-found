const r = require(global.paths.server + '/requires');

const m = {
	clear: () => {

		return new r.Promise((resolve) => {

			r.Promise.all([
				r.User.remove(),
				r.AppConfig.remove(),
				r.Report.remove(),
				r.Comment.remove()
			])
			.then(() => {
				console.log('reset > db');
				resolve();
			});
		});
	},
	post: {
		users: () => {

			return new r.Promise((resolve) => {

				let tasks = [];

				for (let user of r.tasks.data.mocks.users) {

					let req = r.tasks.shared.getNewReq();
					req.query.action = 'register';
					req.body = user;

					tasks.push(new r.Promise((resolve) => {
						r.actions.user.post.register(req, undefined, (body) => {
							console.log('registered > ' + user.username);
							resolve();
						});
					}));
				}

				r.Promise.all(tasks).then(() => {
					resolve();
				});
			});
		},
		reports: () => {

			return new r.Promise((resolve) => {

				let tasks = [];

				for (var i = 0; i < r.tasks.data.mocks.users.length; i++) {

					let mockedUser = r.tasks.data.mocks.users[i];
					let dbUser = r.tasks.data.db.users[i];

					for (let report of mockedUser.reports) {

						let req = r.tasks.shared.getNewReq();
						req.decoded._id = dbUser._id;
						req.body = report;

						tasks.push(new r.Promise((resolve) => {
							r.actions.report.post.before(req, undefined, (body) => {
								console.log('reported > ' + report.title);
								resolve();
							});
						}));
					}
				}

				r.Promise.all(tasks).then(() => {
					resolve();
				});
			});
		}
	},
	updateFileNames: (subject, files) => {

		return new r.Promise((resolve, reject) => {

			let tasks = [];

			if (subject == 'user_avatar') {

				for (let file of files) {
					tasks.push(new r.Promise((resolve, reject) => {
						r.User.findOne({ _id: file.userId }, (err, user) => {
							if (!err) { user.update({ photos: [{ filename: file.filename, size: 100 }] }, () => { resolve(); }); } else { reject(err); }
						});
					}));
				}

			} else if (subject == 'report_photos') {

				let data = {};

				for (let file of files) {

					if (!data[file.reportId]) {
						data[file.reportId] = [{ filename: file.filename, size: 100 }];

					} else {
						data[file.reportId].push({ filename: file.filename, size: 100 });
					}
				}

				for (let reportId in data) {
					tasks.push(new r.Promise((resolve, reject) => {
						r.Report.findOne({ _id: reportId }, (err, report) => {

							if (!err) {
								report.update({ avatar: data[reportId][0].filename, photos: data[reportId] }, () => { resolve(); });

							} else { reject(err); }
						});
					}));
				}
			}

			r.Promise.all(tasks).then(() => {
				console.log('db updated > ' + subject);
				resolve();
			}, reject);
		});
	}
};

module.exports = m;