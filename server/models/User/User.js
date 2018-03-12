let UserSchema = require('./schema');
let preHooks = require('./hooks/pre');
let postHooks = require('./hooks/post');

UserSchema.pre('validate', preHooks.validate);
UserSchema.pre('save', preHooks.save);
UserSchema.post('remove', postHooks.remove);

UserSchema.methods = require('./methods');
UserSchema.statics = require('./statics');
UserSchema.statics.config = require('./config');

module.exports = UserSchema;