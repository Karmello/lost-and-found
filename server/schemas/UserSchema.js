var r = require(global.paths._requires);
var glVal = r.validators.globalValidators;
var userVal = r.validators.userValidators;
var SALT_WORK_FACTOR = 10;



var UserSchema = new r.mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: [userVal.email.correctness, userVal.email.length, userVal.email.uniqueness]
	},
	username: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_multiple_words, userVal.username.length, userVal.username.uniqueness]
	},
	password: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_multiple_words, userVal.password.length]
	},
	firstname: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_digits, userVal.firstname.length]
	},
	lastname: {
		type: String,
		required: true,
		validate: [glVal.string.no_special_chars, glVal.string.no_digits, userVal.lastname.length]
	},
	country: {
		type: String,
        required: true,
        validate: [userVal.country.correctness]
	},
	registration_date: {
		type: Date,
		default: Date.now
	},
	photos: [{
		filename: {
			type: String,
			required: true
		},
		size: {
			type: Number,
			required: true
		}
	}]
}, { versionKey: false });



UserSchema.methods = {
	toJSON: function() {

		var user = this.toObject();
		delete user.password;
		return user;
	},
	comparePasswords: function(currentPassword, cb) {

        r.bcrypt.compare(currentPassword, this.password, function(err, isMatch) {
            if (err) { cb(err); } else { cb(null, isMatch); }
        });
    },
	hashPassword: function(next) {

		var doc = this;

		// Password not modified
	    if (!doc.isModified('password')) {
	        next();

	    // New password needs to be encrypted
	    } else {

	    	// Encrypting password
	        r.bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

	            if (err) { return next(err); }

	            r.bcrypt.hash(doc.password, salt, undefined, function(err, hash) {

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

		var doc = this;

		return new r.Promise(function(resolve) {

			if (doc.photos.length > 0) {

				r.modules.aws3Module.s3.deleteObject({
		            Bucket: process.env.AWS3_UPLOADS_BUCKET_URL,
		            Key: doc._id + '/' + doc.photos[0].filename

		        }, function(err, data) {
		        	resolve(!Boolean(err));
		        });

			} else { resolve(true); }
		});
	}
};

UserSchema.statics = {
	isCurrentRequester: function(req, userId) {

		return req.decoded._doc._id.toString() == userId.toString();
	}
};



UserSchema.pre('validate', function(next) {

	r.modules.modelDataModule.trimStrings(this, function() {
		next();
	});
});

UserSchema.pre('save', function(next) {

	this.hashPassword(function() { next(); });
});

UserSchema.post('remove', function(doc) {

	// Removing appConfig from db
	r.AppConfig.findOne({ userId: doc._id }, function(err, appConfig) {
		if (!err && appConfig) { appConfig.remove(); }
	});

	// Removing items from db
	r.Item.find({ userId: doc._id }, function(err, items) {
		if (!err && items) {
			items.forEach(function(item) { item.remove(); });
		}
	});

	// Removing avatar file from S3
	doc.removeAvatarFromS3();
});



module.exports = UserSchema;