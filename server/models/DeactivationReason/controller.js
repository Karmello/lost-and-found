const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

  let rest = cm.libs.restful.model('deactivation_reason', app.models.DeactivationReason).methods(['get']);
  cm.DeactivationReason = rest;

  rest.before('get', cm.actions.deactivation_reason.get);
  rest.register(app, route);

  return (req, res, next) => { next(); };
};