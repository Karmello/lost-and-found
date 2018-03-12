let ReportSchema = require('./schema');
let preHooks = require('./hooks/pre');
let postHooks = require('./hooks/post');

ReportSchema.pre('validate', preHooks.validate);
ReportSchema.post('remove', postHooks.remove);

ReportSchema.methods = require('./methods');
ReportSchema.statics = require('./statics');
ReportSchema.statics.config = require('./config');

module.exports = ReportSchema;