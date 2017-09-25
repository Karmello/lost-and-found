const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

  let rest = cm.libs.restful.model('comment', app.models.Comment).methods(['post', 'get', 'put', 'delete']);
  cm.Comment = rest;

  rest.before('post', [cm.User.authenticateToken, cm.actions.comment.post]);
  rest.before('get', [cm.actions.comment.get]);
  rest.before('put', [cm.User.authenticateToken, cm.actions.comment.put]);
  rest.before('delete', [cm.User.authenticateToken, cm.actions.comment.delete]);

  rest.register(app, route);
  return (req, res, next) => { next(); };
};