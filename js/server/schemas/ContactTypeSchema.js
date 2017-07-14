var r = require(global.paths.server + '/requires');

module.exports = new r.mongoose.Schema({
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