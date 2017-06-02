var r = require(global.paths._requires);
var reportEventVal = r.validators.reportEventValidators;

var ReportEventSchema = new r.mongoose.Schema({
	group: {
		type: String,
		required: true,
		validate: [reportEventVal.group.correctness]
	},
	date: {
		type: Date,
		required: true
	},
	placeId: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	lat: {
		type: Number,
		required: true
	},
	lng: {
		type: Number,
		required: true
	},
	details: {
		type: String,
		required: true,
		validate: [reportEventVal.details.length]
	}
});

module.exports = ReportEventSchema;