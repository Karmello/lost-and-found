let ReportSchema = require('./schema');
let preHooks = require('./preHooks');
let postHooks = require('./postHooks');

ReportSchema.pre('validate', preHooks.validate);
ReportSchema.post('remove', postHooks.remove);

ReportSchema.methods = require('./methods');
ReportSchema.statics = require('./statics');

module.exports = ReportSchema;