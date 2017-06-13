var r = require(global.paths._requires);
var commentVal = r.validators.commentValidators;

var CommentSchema = new r.mongoose.Schema({
	userId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	content: {
		type: String,
		required: true,
		validate: [commentVal.content.length]
	},
	dateAdded: {
		type: Date,
		default: Date.now
	},
	comments: [global.paths.schemas + 'CommentSchema']
}, { versionKey: false });

module.exports = CommentSchema;