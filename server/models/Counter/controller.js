const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

  let rest = cm.libs.restful.model('counter', app.models.Counter).methods([]);
  cm.Counter = rest;

  rest.register(app, route);
  return (req, res, next) => { next(); };
};