var r = require(global.paths._requires);
var reportEventVal = r.validators.reportEventValidators;

module.exports = new r.mongoose.Schema({
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
	geolocation: {
		type: r.mongoose.Schema.Types.Mixed,
		required: true
	},
	details: {
		type: String,
		required: true,
		validate: [reportEventVal.details.length]
	}
});