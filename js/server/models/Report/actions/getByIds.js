const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  cm.User.findOne({ _id: action.req.decoded._id }, (err, user) => {

    if (!err && user) {

      let tasks = [];

      for (let userId of user.reportsRecentlyViewed.reverse()) {
        tasks.push(cm.Report.findOne({ _id: userId }));
      }

      cm.libs.Promise.all(tasks).then((reports) => {
        action.end(200, {
          meta: { count: reports.length },
          collection: reports
        });
      });

    } else { action.end(400, err); }
  });
};