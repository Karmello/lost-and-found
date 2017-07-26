const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	type: {
		type: String,
		required: true,
		validate: [cm.modules.validator.get('ReportEvent', 'type', 'correctness')]
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
		validate: [cm.modules.validator.get('ReportEvent', 'address', 'correctness')]
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
		validate: [cm.modules.validator.string.length('ReportEvent', 'details')]
	}
});