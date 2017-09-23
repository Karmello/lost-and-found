const cm = require(global.paths.server + '/cm');

module.exports = {
	toJSON: function() {

		let user = this.toObject();
		delete user.password;
		return user;
	},
	comparePasswords: function(current, cb) {

        cm.libs.bcrypt.compare(current, this.password, (err, isMatch) => {
            if (err) { cb(err); } else { cb(null, isMatch); }
        });
    },
	hashPassword: function(next) {

		let SALT_WORK_FACTOR = 10;
		let doc = this;

		// Password not modified
	    if (!doc.isModified('password')) {
	        next();

	    // New password needs to be encrypted
	    } else {

	    	// Encrypting password
	        cm.libs.bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

	            if (err) { return next(err); }

	            cm.libs.bcrypt.hash(doc.password, salt, undefined, (err, hash) => {

	                if (err) { next(err); } else {

	                	// Updating password to encrypted one in doc
	                	doc.password = hash;
	                	next();
	                }
	            });
	        });
	    }
	},
	removeAvatarFromS3: function() {

		let doc = this;

		return new cm.libs.Promise((resolve) => {

			if (doc.photos.length > 0) {

				let bucketNames = [process.env.AWS3_UPLOADS_BUCKET_URL, process.env.AWS3_RESIZED_UPLOADS_BUCKET_URL];
				let keys = [doc._id + '/' + doc.photos[0].filename, 'resized-' + doc._id + '/' + doc.photos[0].filename];
				let tasks = [];

				for (let i = 0; i < bucketNames.length; i++) {
					tasks.push(new Promise((resolve) => {
						cm.modules.aws3.s3.deleteObject({
				            Bucket: bucketNames[i],
				            Key: keys[i]

				        }, (err, data) => {
				        	resolve(!Boolean(err));
				        });
					}));
				}

				cm.libs.Promise.all(() => { resolve(true); }, () => { resolve(false); });

			} else { resolve(true); }
		});
	}
};