const cm = require(global.paths.server + '/cm');
const reportVal = cm.validators.report;

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

ReportSchema.path('photos').validate(reportVal.photos.validator, undefined, reportVal.photos.type);

module.exports = ReportSchema;