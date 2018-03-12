module.exports = {
  user: {
    get: require('./User/actions/get'),
    post: {
      authenticate: require('./User/actions/authenticate'),
      login: require('./User/actions/login'),
      register: require('./User/actions/register'),
      updatePass: require('./User/actions/updatePassword')
    },
    put: require('./User/actions/put'),
    delete: require('./User/actions/delete')
  },
  report: {
    getById: require('./Report/actions/getById'),
    getByIds: require('./Report/actions/getByIds'),
    getByQuery: require('./Report/actions/getBySearchQuery'),
    post: require('./Report/actions/post'),
    put: require('./Report/actions/put'),
    delete: require('./Report/actions/delete'),
    runValidation: require('./Report/actions/runValidation')
  },
  comment: {
    get: require('./Comment/actions/get'),
    post: require('./Comment/actions/post'),
    put: require('./Comment/actions/put'),
    delete: require('./Comment/actions/delete')
  },
  contact_type: {
    get: require('./ContactType/actions/get'),
    post: require('./ContactType/actions/post')
  },
  deactivation_reason: {
    get: require('./DeactivationReason/actions/get')
  },
  password: {
    recover: require('./Password/actions/recover'),
    reset: require('./Password/actions/reset')
  },
  payment: {
    post: require('./Payment/actions/post')
  },
  getStats: require('./getStats')
};