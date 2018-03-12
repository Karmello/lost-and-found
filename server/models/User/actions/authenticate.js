const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  // Authenticating user token
  cm.User.authenticateToken(action.req, action.res, () => {

    // Getting user from db
    cm.User.findOne({ _id: action.req.decoded._id }, (err, user) => {

      if (!err && user) {

        // Updating current session
        action.req.session.theme = user.config.theme;
        action.req.session.language = user.config.language;

        // Sending user back to client
        action.end(200, { user: user });

      } else { action.end(401, err); }
    });
  });
};