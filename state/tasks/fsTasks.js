const r = require(global.paths.server + '/requires');

const m = {
	readUserImgs: () => {

		return new r.Promise((resolve) => {

			let tasks = [];

			for (let i = 0; i < r.tasks.data.mocks.users.length; i++) {

				tasks.push(new r.Promise((resolve, reject) => {
					r.fs.readFile(r.tasks.data.mocks.users[i].avatarPath, (err, fileData) => {

						if (!err) {

							let imgPath = r.tasks.data.mocks.users[i].avatarPath;

							resolve({
								userId: r.tasks.data.db.users[i]._id,
								fileType: 'img/' + imgPath.substring(imgPath.lastIndexOf('.') + 1, imgPath.length),
								fileData: fileData
							});

						} else { reject(err); }
					});
				}));
			}

			r.Promise.all(tasks).then((files) => {
				console.log('files read in > user imgs');
				resolve(files);
			});
		});
	},
	readReportImgs: () => {

		return new r.Promise((resolve) => {

			let usersFolderPath = global.paths.root + '/state/users';
			let tasks = [];

			let userIds = r.fs.readdirSync(usersFolderPath);

			for (let userId of userIds) {

				let reportIds = r.fs.readdirSync(usersFolderPath + '/' + userId + '/reports');

				for (let reportId of reportIds) {

					let imgsFolderPath = usersFolderPath + '/' + userId + '/reports/' + reportId + '/imgs';
					let imgNames = r.fs.readdirSync(imgsFolderPath);

					for (let imgName of imgNames) {

						tasks.push(new r.Promise((resolve) => {

							let imgPath = imgsFolderPath + '/' + imgName;

							r.fs.readFile(imgPath, (err, fileData) => {

								if (!err) {
									resolve({
										userId: userId,
										reportId: reportId,
										fileType: 'img/' + imgPath.substring(imgPath.lastIndexOf('.') + 1, imgPath.length),
										fileData: fileData
									});

								} else { reject(err); }
							});
						}));
					}
				}
			}

			r.Promise.all(tasks).then((files) => {
				console.log('files read in > report imgs');
				resolve(files);
			});
		});
	}
};

module.exports = m;