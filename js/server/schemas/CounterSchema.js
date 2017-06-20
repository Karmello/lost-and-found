var r = require(global.paths._requires);

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