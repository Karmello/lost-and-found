const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  cm.Report.findOne({ _id: action.req.params.id }, (err, report) => {

    if (err) { return action.end(400, err); }

    report.category1 = action.req.body.category1;
    report.category2 = action.req.body.category2;
    report.category3 = action.req.body.category3;

    report.title = action.req.body.title;
    report.description = action.req.body.description;
    report.serialNo = action.req.body.serialNo;

    if (action.req.body.photos.length > 0) {

      if (action.req.body.avatar) {
        report.avatar = action.req.body.avatar;

      } else {
        report.avatar = action.req.body.photos[0].filename;
      }

    } else { report.avatar = undefined; }

    report.photos = action.req.body.photos;
    report.startEvent = new cm.ReportEvent(action.req.body.startEvent);

    cm.actions.report.runValidation(report).then(() => {

      report.save({ validateBeforeSave: false }, (err) => {
        if (!err) { action.end(200, report); } else { action.end(400, err); }
      });

    }, (err) => { action.end(400, err); });
  });
};