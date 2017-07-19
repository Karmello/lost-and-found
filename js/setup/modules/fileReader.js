const r = require(global.paths.server + '/requires');

module.exports = {
	readImgs: (data) => {

		let tasks = [];

		switch (r.setup.subject) {

			case 'User':

				for (let config of data) {

					tasks.push(new r.Promise((resolve, reject) => {
						r.fs.readFile(global.paths.root + config.avatarPath, (err, fileData) => {

							if (!err) {
								resolve({
									userId: config._id,
									fileType: 'image/' + config.avatarPath.substring(config.avatarPath.lastIndexOf('.') + 1, config.avatarPath.length),
									fileData: fileData
								});

							} else { reject(err); }
						});
					}));
				}

				break;

			case 'Report':

				let fakeDataPath = global.paths.root + '/resources/fake-data';
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

				break;
		}

		return r.Promise.all(tasks);
	}
};