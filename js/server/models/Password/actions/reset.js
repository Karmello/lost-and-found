const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  cm.User.findOne({ email: action.req.decoded.email }, '-email', (err, user) => {

    if (!err && user) {

      user.password = Math.random().toString(36).slice(-8);

      let mail = cm.modules.email.create('new_pass', action.req.session.language, action.req.decoded.email, {
        username: user.username,
        password: user.password
      });

      cm.modules.email.send(mail, (err) => {

        if (!err) {

          delete user.username;

          user.save((err) => {

            if (!err) {
              action.res.redirect('/#/start/login?action=pass_reset');

            } else { action.res.redirect('/'); }
          });

        } else { action.res.status(500).send('COULD_NOT_SEND_EMAIL'); }
      });

    } else { action.res.redirect('/'); }
  });
};