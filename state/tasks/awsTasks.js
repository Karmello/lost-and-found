const r = require(global.paths.server + '/requires');

const m = {
	emptyBuckets: () => {

		return new r.Promise((resolve) => {

			r.Promise.all([
				r.modules.aws3Module.emptyBucket('laf.useruploads'),
				r.modules.aws3Module.emptyBucket('laf.useruploadsresized')
			])
			.then(() => {
				console.log('buckets emptied');
				resolve();
			});
		});
	},
	singleImgToAws: (i, file) => {

		return new r.Promise((resolve, reject) => {

			let avatarPath = r.tasks.data.mocks.users[i].avatarPath;

			r.modules.aws3Module.get_upload_credentials({
				headers: { subject: 'user_avatar' },
				body: { fileTypes: ['img/' + avatarPath.substring(avatarPath.lastIndexOf('.') + 1, avatarPath.length)] },
				decoded: { _id: r.tasks.data.db.users[i]._id }
			}, undefined, (credentials) => {

				r.modules.aws3Module.s3.putObject({
					Bucket: 'laf.useruploads',
					Key: credentials[0].awsFormData.key,
					Body: file

				}, function(err, data) {

					if (!err) {
						console.log(credentials[0].awsFilename + ' uploaded');
						resolve(credentials[0].awsFilename);

					} else { reject(err); }
				});
			});
		});
	}
};

module.exports = m;