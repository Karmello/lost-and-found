var r = require(global.paths.server + '/requires');

module.exports = new r.mongoose.Schema({
	language: {
		type: String,
		required: false
	},
	theme: {
		type: String,
		required: true
	}
}, { versionKey: false });