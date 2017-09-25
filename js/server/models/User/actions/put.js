const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  new cm.libs.Promise((resolve, reject) => {

    cm.User.findOne({ _id: action.req.params.id }, 'email firstname lastname country photos config', (err, user) => {

      if (!err && user) {

        user.email = action.req.body.email;
        user.firstname = action.req.body.firstname;
        user.lastname = action.req.body.lastname;
        user.country = action.req.body.country;
        user.photos = action.req.body.photos.slice(0, 1);
        user.config = action.req.body.config;

        new cm.libs.Promise((resolve) => {

          user.validate((err) => {

            if (!err) {
              resolve();

            } else if (err) {

              if (err.errors.email && err.errors.email.kind == 'not_unique' && user.email == action.req.body.email) {
                delete err.errors.email;
                if (Object.keys(err.errors).length === 0) { return resolve(); }
              }

              reject(err);
            }
          });

        }).then(() => {

          user.save({ validateBeforeSave: false }, (err) => {
            if (!err) { resolve(user); } else { reject(err); }
          });
        });

      } else { reject(err); }
    });

  }).then((user) => {

    let msg = { title: cm.hardData[action.req.session.language].msgs.titles[1] };

    if (action.req.headers.action === 'userConfigUpdate') {
      msg.info = cm.hardData[action.req.session.language].msgs.infos[2];
      msg.reload = true;
      action.req.session.theme = user.config.theme;
      action.req.session.language = user.config.language;

    } else {
      msg.info = cm.hardData[action.req.session.language].msgs.infos[1];
    }

    action.end(200, {
      authToken: cm.libs.jwt.sign({ _id: user._id }, process.env.AUTH_SECRET, { expiresIn: cm.app.get('AUTH_TOKEN_EXPIRES_IN') }),
      msg: msg
    });

  }, (err) => { action.end(400, err); });
};