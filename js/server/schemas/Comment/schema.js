const cm = require(global.paths.server + '/cm');
const commentVal = cm.validators.comment;

let CommentSchema = new cm.libs.mongoose.Schema({
	parentId: {
		type: cm.libs.mongoose.Schema.Types.ObjectId,
		ref: 'comment'
	},
	userId: {
		type: cm.libs.mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	content: {
		type: String,
		required: true,
		validate: [commentVal.content.length]
	},
	likes: [{
		type: cm.libs.mongoose.Schema.Types.ObjectId,
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