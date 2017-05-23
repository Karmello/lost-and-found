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
	categoryId: {
		type: String,
		ref: 'report_category',
		validate: [reportVal.categoryId.correctness],
		required: true
	},
	subcategoryId: {
		type: String,
		ref: 'report_subcategory',
		validate: [reportVal.subcategoryId.correctness],
		required: true
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
	avatarFileName: {
		type: String,
		default: ''
	},
	photos: [global.paths.schemas + 'ReportPhotoSchema'],
	comments: [global.paths.schemas + 'CommentSchema'],
	events: [global.paths.schemas + 'ReportEventSchema']
}, { versionKey: false });



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

	r.modules.socketModule.emitReportsCount(doc.group);
});



module.exports = ReportSchema;