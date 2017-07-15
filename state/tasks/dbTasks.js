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
				console.log('db cleared');
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
							console.log(user.username + ' registered');
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
								console.log(report.title + ' reported');
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
	setAvatars: (filenames) => {

		return new r.Promise((resolve) => {

			let tasks = [];

			for (var i = 0; i < filenames.length; i++) {
				tasks.push(r.tasks.data.db.users[i].update({
					photos: [{ filename: filenames[i], size: 100 }]
				}));
			}

			r.Promise.all(tasks).then(() => {
				console.log('user avatars set');
				resolve();
			});
		});
	}
};

module.exports = m;