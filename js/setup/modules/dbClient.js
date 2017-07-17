const r = require(global.paths.server + '/requires');

module.exports = {
	post: (subject, data) => {

		let tasks = [];

		for (let config of data) {

			tasks.push(new r[subject](config).save((err) => {

				if (!err) {
					let name;
					if (subject === 'User') { name = config.username; } else if (subject === 'Report') { name = config.title; }
					console.log('"' + name + '" saved');
				}
			}));
		}

		return r.Promise.all(tasks);
	},
	updateFileNames: (subject, files) => {

		return new r.Promise((resolve, reject) => {

			let tasks = [];

			if (subject == 'user_photo') {

				for (let file of files) {
					tasks.push(new r.Promise((resolve, reject) => {
						r.User.findOne({ _id: file.userId }, (err, user) => {
							if (!err) { user.update({ photos: [{ filename: file.filename, size: 100 }] }, () => { resolve(); }); } else { reject(err); }
						});
					}));
				}

			} else if (subject == 'report_photo') {

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
				resolve();
			}, reject);
		});
	}
};