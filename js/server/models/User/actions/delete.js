const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);
  let tasks = [];

  tasks.push(cm.User.findOne({ _id: action.req.decoded._id }));
  tasks.push(cm.DeactivationReason.findOne({ _id: action.req.query.deactivationReasonId }));

  cm.libs.Promise.all(tasks).then((data) => {

    if (data[0] && data[1]) {

      let user = data[0];
      let deactivationReason = data[1];
      let delPromise = user.remove();

      delPromise.then(() => {

        deactivationReason.count += 1;
        let savePromise = deactivationReason.save();
        savePromise.then(() => { action.end(204); }, () => { action.end(204); });

      }, (err) => { action.end(500, err); });

    } else { action.end(400); }

  }, (err) => { action.end(400, err); });
};