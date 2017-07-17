var r = require(global.paths.server + '/requires');
var reportVal = r.validators.reportValidators;



var ReportSchema = new r.mongoose.Schema({
	dateAdded: {
		type: Date,
		default: Date.now
	},
	userId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	category1: {
		type: String,
		validate: [reportVal.category1.correctness],
		required: true
	},
	category2: {
		type: String,
		validate: [reportVal.category2.correctness]
	},
	category3: {
		type: String,
		validate: [reportVal.category3.correctness]
	},
	title: {
		type: String,
		validate: [reportVal.title.length],
		required: true
	},
	description: {
		type: String,
		validate: [reportVal.description.length],
		required: true
	},
	serialNo: {
		type: String
	},
	avatar: {
		type: String,
		validate: [reportVal.avatar.correctness]
	},
	photos: [global.paths.server + '/schemas/ReportPhotoSchema'],
	comments: [{
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'comment'
	}],
	startEvent: {
		type: r.mongoose.Schema.Types.Mixed,
		ref: 'report_event',
		required: true
	},
	endEvent: {
		type: r.mongoose.Schema.Types.Mixed,
		ref: 'report_event'
	}
}, { versionKey: false });

ReportSchema.path('photos').validate(reportVal.photos.validator, undefined, reportVal.photos.type);



ReportSchema.methods = {
	removePhotosFromS3: function() {

		return new r.Promise((resolve) => {

			let doc = this;
			let bucketNames = [process.env.AWS3_UPLOADS_BUCKET_URL, process.env.AWS3_RESIZED_UPLOADS_BUCKET_URL];
			let keys = [doc.userId + '/reports/' + doc._id + '/', 'resized-' + doc.userId + '/reports/' + doc._id + '/'];
			let tasks = [];

			for (let photo of doc.photos) {
				for (let i = 0; i < bucketNames.length; i++) {

					tasks.push(new r.Promise((resolve) => {
						r.modules.aws3Module.s3.deleteObject({
				            Bucket: bucketNames[i],
				            Key: keys[i] + photo.filename

				        }, function(err, data) {
				        	resolve(!Boolean(err));
				        });
					}));
				}
			}

			r.Promise.all(() => { resolve(true); }, () => { resolve(false); });
		});
	}
};



ReportSchema.pre('validate', function(next) {

	r.modules.modelDataModule.trimStrings(this, function() {
		next();
	});
});

ReportSchema.post('remove', function(doc) {

	// Removing photos from S3
	doc.removePhotosFromS3();

	// Removing comments
	r.Comment.remove({ _id: { $in: doc.comments } }, function(err) {});

	// Removing report id from reportsRecentlyViewed users array
	r.User.update({ reportsRecentlyViewed: doc._id }, { $pull: { reportsRecentlyViewed: doc._id } }, function(err) {
		if (err) { console.error(err); }
	});

	// Emiting event to all clients
	r.modules.socketModule.emitReportsCount(doc.startEvent.type);
});



module.exports = ReportSchema;