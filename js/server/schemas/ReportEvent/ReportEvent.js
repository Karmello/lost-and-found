const cm = require(global.paths.server + '/cm');
const reportEventVal = cm.validators.reportEvent;

module.exports = new cm.libs.mongoose.Schema({
	type: {
		type: String,
		required: true,
		validate: [reportEventVal.type.correctness]
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
		required: true,
		validate: [reportEventVal.location.correctness]
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