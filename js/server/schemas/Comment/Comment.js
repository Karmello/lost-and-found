let CommentSchema = require('./schema');
let postHooks = require('./postHooks');

CommentSchema.post('save', postHooks.save);
CommentSchema.post('remove', postHooks.remove);

module.exports = CommentSchema;