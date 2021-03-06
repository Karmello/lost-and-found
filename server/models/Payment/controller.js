const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

  let rest = cm.libs.restful.model('payment', app.models.Payment).methods(['get', 'post']);
  cm.Payment = rest;

  rest.before('get', [cm.User.authenticateToken, cm.Payment.validatePaymentAction]);
  rest.before('post', [cm.User.authenticateToken, cm.actions.payment.post]);
  rest.register(app, route);

  return (req, res, next) => { next(); };
};