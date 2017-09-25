const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);
  let tasks = [];

  tasks.push(cm.User.count());
  tasks.push(cm.Report.count());
  tasks.push(cm.Report.count({ 'startEvent.type': 'lost' }));
  tasks.push(cm.Report.count({ 'startEvent.type': 'found' }));

  cm.libs.Promise.all(tasks).then((data) => {

    action.end(200, {
      usersCount: data[0],
      reportsCount: data[1],
      lostReportsCount: data[2],
      foundReportsCount: data[3]
    });

  }, (err) => { action.end(500, err); });
};