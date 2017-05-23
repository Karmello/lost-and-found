var r = require(global.paths._requires);

module.exports = new r.mongoose.Schema({
	group: {
		type: String,
		required: true
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
		required: true
	}
});