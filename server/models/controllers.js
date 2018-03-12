module.exports = {
  '/users': require('./User/controller'),
  '/reports': require('./Report/controller'),
  '/comments': require('./Comment/controller'),
  '/payments': require('./Payment/controller'),
  '/deactivation_reasons': require('./DeactivationReason/controller'),
  '/contact_types': require('./ContactType/controller'),
  '/counters': require('./Counter/controller')
};