const r = require(global.paths.server + '/requires');

const m = {
	emptyBuckets: () => {

		return new r.Promise((resolve) => {

			r.Promise.all([
				r.modules.aws3Module.emptyBucket('laf.useruploads'),
				r.modules.aws3Module.emptyBucket('laf.useruploadsresized')
			])
			.then(() => {
				console.log('reset > s3 buckets');
				resolve();
			});
		});
	},
	uploadImgs: (subject, files) => {

		let tasks = [];

		for (let i = 0; i < files.length; i++) {
			tasks.push(m.singleImgToAws(subject, files[i]));
		}

		return r.Promise.all(tasks);
	},
	singleImgToAws: (subject, file) => {

		return new r.Promise((resolve, reject) => {

			let body = { fileTypes: [file.fileType] };
			if (file.reportId) { body.reportId = file.reportId; }

			r.modules.aws3Module.get_upload_credentials({
				headers: { subject: subject },
				body: body,
				decoded: { _id: file.userId }
			}, undefined, (credentials) => {

				file.filename = credentials[0].awsFilename;

				r.modules.aws3Module.s3.putObject({
					Bucket: 'laf.useruploads',
					Key: credentials[0].awsFormData.key,
					Body: file.fileData

				}, function(err, data) {

					if (!err) {
						console.log('uploaded > ' + credentials[0].awsFilename);
						resolve(file);

					} else { reject(err); }
				});
			});
		});
	}
};

module.exports = m;