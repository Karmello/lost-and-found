var r = require(global.paths.server + '/requires');

module.exports = new r.mongoose.Schema({
	userId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	language: {
		type: String,
		required: false
	},
	theme: {
		type: String,
		required: true
	}
}, { versionKey: false });