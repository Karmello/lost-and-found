var r = require(global.paths._requires);
var commentVal = r.validators.commentValidators;

var CommentSchema = new r.mongoose.Schema({
	parentId: {
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'comment'
	},
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
	likes: [{
		type: r.mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
	dateAdded: {
		type: Date,
		default: Date.now
	}
}, { versionKey: false });

CommentSchema.add({
	comments: [CommentSchema]
});

module.exports = CommentSchema;