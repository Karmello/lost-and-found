let UserSchema = require('./schema');
let preHooks = require('./preHooks');
let postHooks = require('./postHooks');

UserSchema.pre('validate', preHooks.validate);
UserSchema.pre('save', preHooks.save);
UserSchema.post('remove', postHooks.remove);

UserSchema.methods = require('./methods');
UserSchema.statics = require('./statics');

module.exports = UserSchema;