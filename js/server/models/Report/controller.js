const cm = require(global.paths.server + '/cm');

module.exports = (app, route) => {

  let rest = cm.libs.restful.model('report', app.models.Report).methods(['post', 'get', 'put', 'delete']);
  cm.Report = rest;

  rest.before('post', [
    cm.User.authenticateToken,
    cm.Report.validateReportAction,
    cm.actions.report.post
  ]);

  rest.before('get', [cm.Report.validateReportAction, (req, res, next) => {

    switch (req.query.subject) {

      case 'bySearchQuery':
      case 'newlyAdded':
      case 'byUser':

        cm.actions.report.getByQuery(req, res, next);
        break;

      case 'lastViewed':

        cm.User.authenticateToken(req, res, () => {
          cm.actions.report.getByIds(req, res, next);
        });

        break;

      case 'singleOne':

        cm.User.authenticateToken(req, res, () => {
          cm.actions.report.getById(req, res, next);
        });

        break;
    }
  }]);

  rest.before('put', [
    cm.User.authenticateToken,
    cm.Report.validateReportAction,
    cm.actions.report.put
  ]);

  rest.before('delete', [
    cm.User.authenticateToken,
    cm.Report.validateReportAction,
    cm.actions.report.delete
  ]);

  rest.register(app, route);
  return (req, res, next) => { next(); };
};