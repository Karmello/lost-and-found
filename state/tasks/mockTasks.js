const r = require(global.paths.server + '/requires');

const m = {
	users: () => {

		return new r.Promise((resolve) => {

			r.fs.readdir('./state/mockupData/users', function(err, folderNames) {

				for (var folderName of folderNames) {

					var separated = folderName.split('-');
					var firstname = separated[0];
					var lastname = separated[1];
					var country = separated[2];

					r.tasks.data.mocks.users.push({
						email: firstname.toLowerCase() + lastname.toLowerCase() + '@gmail.com',
						username: firstname + lastname,
						password: 'password',
						firstname: firstname,
						lastname: lastname,
						country: country,
						avatarPath: './state/mockupData/users/' + folderName + '/avatar.jpg'
					});
				}

				console.log('users mocked data ready');
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
					let userFolderName = mockedUser.firstname + '-' + mockedUser.lastname + '-' + mockedUser.country;
					let path = './state/mockupData/users/' + userFolderName + '/reports';

					r.fs.readdir(path, (err, reportNames) => {

						for (let reportName of reportNames) {
							mockedUser.reports.push(require('./../mockupData/users/' + userFolderName + '/reports/' + reportName + '/config'));
						}

						resolve();
					});
				}));
			}

			r.Promise.all(tasks).then(() => {

				console.log('user reports mocked data ready');
				resolve();
			});
		});
	}
};

module.exports = m;