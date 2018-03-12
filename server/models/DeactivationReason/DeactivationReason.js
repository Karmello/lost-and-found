const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	index: {
		type: Number,
		required: true
	},
	label: {
		type: Object,
		required: true
	},
	count: {
		type: Number,
		required: true,
		default: 0
	}
}, { versionKey: false });