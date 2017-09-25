const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  cm.ContactType.aggregate([
    {
      $project: {
        'index': 1,
        'label': '$label.' + action.req.session.language
      }
    }
  ], (err, contactTypes) => {
    if (!err && contactTypes) { action.end(200, contactTypes); } else { action.end(500); }
  });
};