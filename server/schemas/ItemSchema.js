var r = require(global.paths._requires);
var itemVal = r.validators.itemValidators;



var ItemSchema = new r.mongoose.Schema({
	userId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	typeId: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	categoryId: {
		type: String,
		ref: 'item_category',
		validate: [itemVal.categoryId.correctness],
		required: true
	},
	subcategoryId: {
		type: String,
		ref: 'item_subcategory',
		validate: [itemVal.subcategoryId.correctness],
		required: true
	},
	title: {
		type: String,
		validate: [itemVal.title.length],
		required: true
	},
	description: {
		type: String,
		validate: [itemVal.description.length],
		required: true
	},
	dateAdded: {
		type: Date,
		default: Date.now
	},
	photos: [global.paths.schemas + 'ItemPhotoSchema'],
	avatarFileName: {
		type: String,
		default: ''
	},
	comments: [global.paths.schemas + 'CommentSchema']
}, { versionKey: false });



ItemSchema.methods = {
	removePhotoFromS3: function(filename) {

		var doc = this;
		var promises = [];

		// Removing original photo
		promises.push(new r.Promise(function(resolve) {

			r.modules.aws3Module.s3.deleteObject({
	            Bucket: process.env.AWS3_UPLOADS_BUCKET_URL,
	            Key: doc.userId + '/items/' + doc._id + '/' + filename

	        }, function(err, data) {
	        	resolve(!Boolean(err));
	        });
		}));

		// Removing thumbnail photo
		promises.push(new r.Promise(function(resolve) {

			r.modules.aws3Module.s3.deleteObject({
	            Bucket: process.env.AWS3_RESIZED_UPLOADS_BUCKET_URL,
	            Key: 'resized-' + doc.userId + '/items/' + doc._id + '/' + filename

	        }, function(err, data) {
	        	resolve(!Boolean(err));
	        });
		}));

		return r.Promise.all(promises);
	}
};



ItemSchema.pre('validate', function(next) {

	r.modules.modelDataModule.trimStrings(this, function() {
		next();
	});
});

ItemSchema.post('remove', function(doc) {

	// Removing photos from S3
	for (var photo of doc.photos) { doc.removePhotoFromS3(photo.filename); }
});



module.exports = ItemSchema;