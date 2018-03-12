const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  let wrongCredentialsErr = {
    name: 'ValidationError',
    message: 'user validation failed',
    errors: { username: { kind: 'wrong_credentials' } }
  };

  cm.User.findOne({ username: action.req.body.username }, (err, user) => {

    if (!err && user) {

      user.comparePasswords(action.req.body.password, (err, isMatch) => {

        if (isMatch) {

          action.req.session.theme = user.config.theme;
          action.req.session.language = user.config.language;

          action.resetBadCount();

          action.end(200, {
            user: user,
            authToken: cm.libs.jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: cm.app.get('AUTH_TOKEN_EXPIRES_IN') })
          });

        } else {

          action.setAsBad();
          action.end(400, wrongCredentialsErr);
        }
      });

    } else {

      action.setAsBad();
      action.end(400, wrongCredentialsErr);
    }
  });
};