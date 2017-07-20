const cm = require(global.paths.server + '/cm');

module.exports = new cm.libs.mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
    seq: {
    	type: Number,
    	default: 0
    }
});