const r = require(global.paths.server + '/requires');

const m = {
	mockData: () => {

		return new r.Promise((resolve) => {

			r.fs.readdir('./state/mockupData/imgs', function(err, filenames) {

				for (var filename of filenames) {

					var separated = filename.substring(0, filename.lastIndexOf('.')).split('-');

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
						avatarPath: './state/mockupData/imgs/' + filename
					});
				}

				console.log('users mocked data ready');
				resolve();
			});
		});
	},
	register: () => {

		const t = require(global.paths.root + '/state/tasks/_tasks');

		return new r.Promise((resolve) => {

			let tasks = [];

			for (var user of r.tasks.data.mocks.users) {

				let req = r.tasks.shared.getNewReq();
				req.query.action = 'register';
				req.body = user;

				tasks.push(new r.Promise((resolve) => {
					r.actions.user.post.register(req, undefined, (body) => { resolve(); });
				}));
			}

			r.Promise.all(tasks).then(() => {
				console.log('users registered');
				resolve();
			});
		});
	},
	uploadAvatars: () => {

		const t = require(global.paths.root + '/state/tasks/_tasks');

		let tasks = [];

		for (let i = 0; i < r.tasks.data.fs.userImgs.length; i++) {
			tasks.push(r.tasks.aws.singleImgToAws(i, r.tasks.data.fs.userImgs[i]));
		}

		return r.Promise.all(tasks);
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