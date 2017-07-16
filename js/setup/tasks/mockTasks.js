const r = require(global.paths.server + '/requires');
const fakeDataPath = '/resources/fake-data';

const m = {
	users: () => {

		return new r.Promise((resolve) => {

			r.fs.readdir('.' + fakeDataPath, function(err, ids) {

				for (var id of ids) {

					var config = require(global.paths.root + fakeDataPath + '/' + id + '/config');

					r.tasks.data.mocks.users.push({
						_id: id,
						email: config.firstname.toLowerCase() + config.lastname.toLowerCase() + '@gmail.com',
						username: config.firstname + config.lastname,
						password: 'password',
						firstname: config.firstname,
						lastname: config.lastname,
						country: config.country,
						avatarPath: fakeDataPath + '/' + id + '/avatar.jpg'
					});
				}

				console.log('data mocked > users');
				resolve();
			});
		});
	},
	reports: () => {

		return new r.Promise((resolve) => {

			let tasks = [];

			for (let i = 0; i < r.tasks.data.mocks.users.length; i++) {

				tasks.push(new r.Promise((resolve) => {

					let mockedUser = r.tasks.data.mocks.users[i];
					let dbUser = r.tasks.data.db.users[i];

					mockedUser.reports = [];

					r.fs.readdir(global.paths.root + fakeDataPath + '/' + mockedUser._id + '/reports', (err, reportIds) => {

						for (let reportId of reportIds) {
							mockedUser.reports.push(require(global.paths.root + fakeDataPath + '/' + mockedUser._id + '/reports/' + reportId + '/config'));
							mockedUser.reports[mockedUser.reports.length - 1]._id = reportId;
						}

						resolve();
					});
				}));
			}

			r.Promise.all(tasks).then(() => {

				console.log('data mocked > reports');
				resolve();
			});
		});
	}
};

module.exports = m;