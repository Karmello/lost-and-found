var r = require(global.paths._requires);

module.exports = new r.mongoose.Schema({
	filename: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		required: true
	}
});