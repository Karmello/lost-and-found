const r = require(global.paths.server + '/requires');

module.exports = {
	get: () => {

		return new r.Promise((resolve, reject) => {

			if (r.setup.subject !== 'User') {
				r.User.find({}, (err, users) => {
					if (!err) { resolve(users); } else { reject(err); }
				});

			} else { resolve(); }
		});
	},
	post: (data) => {

		return new r.Promise((resolve, reject) => {

			let tasks = [];

			let nameFields = {
				User: 'username',
				Report: 'title',
				Comment: 'content'
			};

			for (let config of data) {

				tasks.push(new r[r.setup.subject](config).save((err) => {

					if (!err) {
						console.log('"' + config[nameFields[r.setup.subject]] + '" saved');
					}
				}));
			}

			r.Promise.all(tasks).then(() => { resolve(data); }, reject);
		});
	},
	sync: (files) => {

		return new r.Promise((resolve, reject) => {

			let tasks = [];

			switch (r.setup.subject) {

				case 'User':

					for (let file of files) {
						tasks.push(new r.Promise((resolve, reject) => {
							r.User.findOne({ _id: file.userId }, (err, user) => {
								if (!err) { user.update({ photos: [{ filename: file.filename, size: 100 }] }, () => { resolve(); }); } else { reject(err); }
							});
						}));
					}

					break;

				case 'Report':

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

					break;
			}

			r.Promise.all(tasks).then(() => { resolve(); }, reject);
		});
	}
};