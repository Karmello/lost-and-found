const r = require(global.paths.server + '/requires');

const m = {
	readUserImgs: () => {

		return new r.Promise((resolve) => {

			let tasks = [];

			for (let i = 0; i < r.setup.data.mocks.users.length; i++) {

				tasks.push(new r.Promise((resolve, reject) => {
					r.fs.readFile(global.paths.root + r.setup.data.mocks.users[i].avatarPath, (err, fileData) => {

						if (!err) {

							let imgPath = r.setup.data.mocks.users[i].avatarPath;

							resolve({
								userId: r.setup.data.db.users[i]._id,
								fileType: 'image/' + imgPath.substring(imgPath.lastIndexOf('.') + 1, imgPath.length),
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

			let fakeDataPath = global.paths.root + '/resources/fake-data';
			let tasks = [];

			let userIds = r.fs.readdirSync(fakeDataPath);

			for (let userId of userIds) {

				let reportIds = r.fs.readdirSync(fakeDataPath + '/' + userId + '/reports');

				for (let reportId of reportIds) {

					let imgsFolderPath = fakeDataPath + '/' + userId + '/reports/' + reportId + '/imgs';
					let imgNames = r.fs.readdirSync(imgsFolderPath);

					for (let imgName of imgNames) {

						tasks.push(new r.Promise((resolve) => {

							let imgPath = imgsFolderPath + '/' + imgName;

							r.fs.readFile(imgPath, (err, fileData) => {

								if (!err) {
									resolve({
										userId: userId,
										reportId: reportId,
										fileType: 'image/' + imgPath.substring(imgPath.lastIndexOf('.') + 1, imgPath.length),
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