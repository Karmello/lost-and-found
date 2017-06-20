var r = require(global.paths._requires);
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
	photos: [global.paths.schemas + 'ReportPhotoSchema'],
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
	removePhotoFromS3: function(filename) {

		var doc = this;
		var promises = [];

		// Removing original photo
		promises.push(new r.Promise(function(resolve) {

			r.modules.aws3Module.s3.deleteObject({
	            Bucket: process.env.AWS3_UPLOADS_BUCKET_URL,
	            Key: doc.userId + '/reports/' + doc._id + '/' + filename

	        }, function(err, data) {
	        	resolve(!Boolean(err));
	        });
		}));

		// Removing thumbnail photo
		promises.push(new r.Promise(function(resolve) {

			r.modules.aws3Module.s3.deleteObject({
	            Bucket: process.env.AWS3_RESIZED_UPLOADS_BUCKET_URL,
	            Key: 'resized-' + doc.userId + '/reports/' + doc._id + '/' + filename

	        }, function(err, data) {
	        	resolve(!Boolean(err));
	        });
		}));

		return r.Promise.all(promises);
	}
};



ReportSchema.pre('validate', function(next) {

	r.modules.modelDataModule.trimStrings(this, function() {
		next();
	});
});

ReportSchema.post('remove', function(doc) {

	// Removing photos from S3
	for (var photo of doc.photos) { doc.removePhotoFromS3(photo.filename); }

	// Removing comments
	r.Comment.remove({ _id: { $in: doc.comments } }, function(err) {});

	// Emiting event to all clients
	r.modules.socketModule.emitReportsCount(doc.startEvent.type);
});



module.exports = ReportSchema;