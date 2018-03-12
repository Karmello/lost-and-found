let ReportEventSchema = require('./schema');

ReportEventSchema.statics = {
  config: require('./config')
};

module.exports = ReportEventSchema;