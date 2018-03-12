const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  cm.DeactivationReason.aggregate([
    {
      $project: {
        'index': 1,
        'label': '$label.' + action.req.session.language
      }
    }

  ], (err, deactivationReasons) => {
    if (!err && deactivationReasons) { action.end(200, deactivationReasons); } else { action.end(500, err); }
  });
};