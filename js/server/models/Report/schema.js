const cm = require(global.paths.server + '/cm');

let ReportSchema = new cm.libs.mongoose.Schema({
	dateAdded: {
		type: Date,
		default: Date.now
	},
	userId: {
		type: cm.libs.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	category1: {
		type: String,
		validate: [cm.validators.get('Report', 'category1', 'correctness')],
		required: true
	},
	category2: {
		type: String,
		validate: [cm.validators.get('Report', 'category2', 'correctness')]
	},
	category3: {
		type: String,
		validate: [cm.validators.get('Report', 'category3', 'correctness')]
	},
	title: {
		type: String,
		validate: [cm.validators.length.get('Report', 'title')],
		required: true
	},
	description: {
		type: String,
		validate: [cm.validators.length.get('Report', 'description')],
		required: true
	},
	serialNo: {
		type: String
	},
	avatar: {
		type: String,
		validate: [cm.validators.get('Report', 'avatar', 'correctness')]
	},
	photos: [global.paths.server + '/models/ReportPhoto/ReportPhoto'],
	comments: [{
		type: cm.libs.mongoose.Schema.Types.ObjectId,
		ref: 'comment'
	}],
	startEvent: {
		type: cm.libs.mongoose.Schema.Types.Mixed,
		ref: 'report_event',
		required: true
	},
	endEvent: {
		type: cm.libs.mongoose.Schema.Types.Mixed,
		ref: 'report_event'
	}
}, { versionKey: false });

let photosValidator = cm.validators.get('Report', 'photos', 'correctness');
ReportSchema.path('photos').validate(photosValidator.validator, undefined, photosValidator.type);

module.exports = ReportSchema;