const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	filename: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		required: true
	}
});