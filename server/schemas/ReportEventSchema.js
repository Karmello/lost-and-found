var r = require(global.paths._requires);

module.exports = new r.mongoose.Schema({
	reportId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'report',
		required: true
	},
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