const cm = require(global.paths.server + '/cm');

module.exports = {
	removePhotosFromS3: function() {

		return new cm.libs.Promise((resolve) => {

			let doc = this;
			let bucketNames = [process.env.AWS3_UPLOADS_BUCKET_URL, process.env.AWS3_RESIZED_UPLOADS_BUCKET_URL];
			let keys = [doc.userId + '/reports/' + doc._id + '/', 'resized-' + doc.userId + '/reports/' + doc._id + '/'];
			let tasks = [];

			for (let photo of doc.photos) {
				for (let i = 0; i < bucketNames.length; i++) {

					tasks.push(new cm.libs.Promise((resolve) => {
						cm.modules.aws3.s3.deleteObject({
				            Bucket: bucketNames[i],
				            Key: keys[i] + photo.filename

				        }, (err, data) => {
				        	resolve(!Boolean(err));
				        });
					}));
				}
			}

			cm.libs.Promise.all(() => { resolve(true); }, () => { resolve(false); });
		});
	}
};