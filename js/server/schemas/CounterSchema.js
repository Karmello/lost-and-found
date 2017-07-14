var r = require(global.paths.server + '/requires');

var CounterSchema = new r.mongoose.Schema({
	_id: {
		type: String,
		required: true
	},
    seq: {
    	type: Number,
    	default: 0
    }
});

module.exports = CounterSchema;