var r = require(global.paths._requires);



var CommentSchema = new r.mongoose.Schema({
	userId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	content: {
		type: String,
		required: true
	},
	dateAdded: {
		type: Date,
		default: Date.now
	}
}, { versionKey: false });



module.exports = CommentSchema;