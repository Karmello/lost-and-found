const r = require(global.paths.server + '/requires');

const m = {
	readImgs: () => {

		return new r.Promise((resolve) => {

			let tasks = [];

			for (let i = 0; i < r.tasks.data.mocks.users.length; i++) {

				tasks.push(new r.Promise((resolve, reject) => {
					r.fs.readFile(r.tasks.data.mocks.users[i].avatarPath, (err, file) => {
						if (!err) { resolve(file); } else { reject(err); }
					});
				}));
			}

			r.Promise.all(tasks).then((files) => {
				console.log('imgs read in');
				resolve(files);
			});
		});
	}
};

module.exports = m;