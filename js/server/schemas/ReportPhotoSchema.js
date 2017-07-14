var r = require(global.paths.server + '/requires');

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