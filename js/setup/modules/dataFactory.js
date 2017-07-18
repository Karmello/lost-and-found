const r = require(global.paths.server + '/requires');
const fakeDataPath = '/resources/fake-data';

const m = {
	prepareUsers: () => {

		return new r.Promise((resolve) => {

			r.fs.readdir('.' + fakeDataPath, function(err, ids) {

				let data = [];

				for (var id of ids) {

					var config = require(global.paths.root + fakeDataPath + '/' + id + '/config');

					data.push({
						_id: id,
						email: config.firstname.toLowerCase() + config.lastname.toLowerCase() + '@gmail.com',
						username: config.firstname + config.lastname,
						password: 'password',
						firstname: config.firstname,
						lastname: config.lastname,
						country: config.country,
						avatarPath: fakeDataPath + '/' + id + '/avatar.jpg',
						config: {
							language: 'en',
							theme: 'standard'
						}
					});
				}

				resolve(data);
			});
		});
	},
	prepareReports: (users) => {

		let tasks = [];

		for (let user of users) {

			let reportsPath = global.paths.root + fakeDataPath + '/' + user._id + '/reports';
			let reportIds = r.fs.readdirSync(reportsPath);

			for (let reportId of reportIds) {

				tasks.push(new r.Promise((resolve) => {
					let config = require(reportsPath + '/' + reportId + '/config');
					config._id = reportId;
					config.userId = user._id;
					resolve(config);
				}));
			}
		}

		return r.Promise.all(tasks);
	},
	prepareComments: (users) => {

		return new r.Promise((resolve, reject) => {

			let comments = require(global.paths.root + '/js/setup/hardcoded/comments');
			let data = [];

			let startDate = new Date(2017, 0, 1);
			let endDate = new Date();

			for (let i = 0; i < 100; i++) {

				data.push({
					parentId: '000000000000000000000005',
					userId: users[Math.floor(Math.random() * (users.length - 1))]._id,
					content: comments[Math.floor(Math.random() * (comments.length - 1))],
					dateAdded: new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
				});
			}

			resolve(data);
		});
	}
};

module.exports = m;