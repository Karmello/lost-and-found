const cm = require(global.paths.server + '/cm');

let singleImgToAws = (subject, file) => {

	return new cm.libs.Promise((resolve, reject) => {

		let body = { fileTypes: [file.fileType] };
		if (file.reportId) { body.reportId = file.reportId; }

		cm.modules.aws3Module.getUploadCredentials({
			headers: { subject: subject },
			body: body,
			decoded: { _id: file.userId }
		}, undefined, (credentials) => {

			file.filename = credentials[0].awsFilename;

			cm.modules.aws3Module.s3.putObject({
				Bucket: 'laf.useruploads',
				Key: credentials[0].awsFormData.key,
				ACL: credentials[0].awsFormData.acl,
				ContentType: credentials[0].awsFormData['content-type'],
				Body: file.fileData

			}, function(err, data) {

				if (!err) {
					console.log('"' + credentials[0].awsFilename + '" uploaded');
					resolve(file);

				} else { reject(err); }
			});
		});
	});
};

module.exports = {
	uploadImgs: (files) => {

		let tasks = [];

		for (let i = 0; i < files.length; i++) {
			tasks.push(singleImgToAws(cm.setup.subject.toLowerCase() + '_photo', files[i]));
		}

		return cm.libs.Promise.all(tasks);
	}
};