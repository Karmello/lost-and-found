let CommentSchema = require('./schema');
let postHooks = require('./hooks/post');

CommentSchema.post('save', postHooks.save);
CommentSchema.post('remove', postHooks.remove);

CommentSchema.statics = {
  config: require('./config')
};

module.exports = CommentSchema;