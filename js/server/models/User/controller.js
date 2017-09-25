const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

  let rest = cm.libs.restful.model('user', app.models.User).methods(['post', 'get', 'put', 'delete']);
  cm.User = rest;

  rest.before('post', [cm.User.validateUserAction, (req, res, next) => {

    if (cm.actions.user.post[req.query.action]) {

      if (['login', 'register'].indexOf(req.query.action) > -1) {
        cm.User.authenticateCaptchaRes(req, res, () => {
          cm.actions.user.post[req.query.action](req, res, next);
        });

      } else { cm.actions.user.post[req.query.action](req, res, next); }

    } else { res.send(400); }
  }]);

  rest.before('get', [
    cm.User.authenticateToken,
    cm.actions.user.get
  ]);

  rest.before('put', [
    cm.User.authenticateToken,
    cm.User.validateUserAction,
    cm.actions.user.put
  ]);

  rest.before('delete', [
    cm.User.authenticateToken,
    cm.User.validateUserAction,
    cm.actions.user.delete
  ]);

  rest.register(app, route);
  return (req, res, next) => { next(); };
};