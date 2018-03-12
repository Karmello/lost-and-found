const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);

  let err = {
    name: 'ValidationError',
    message: 'contact_type validation failed',
    errors: {}
  };

  new cm.libs.Promise((resolve) => {

    if (!action.req.body.contactType) { err.errors.contactType = { kind: 'required' }; }
    if (!action.req.body.contactMsg) { err.errors.contactMsg = { kind: 'required' }; }

    if (Object.keys(err.errors).length > 0) {
      action.end(400, err);

    } else {

      let tasks = [];

      tasks.push(cm.User.findOne({ _id: action.req.decoded._id }));
      tasks.push(cm.ContactType.findOne({ _id: action.req.body.contactType }));

      cm.libs.Promise.all(tasks).then((results) => {
        resolve({ user: results[0], contactType: results[1] });

      }, (err) => {
        action.end(400, err);
      });
    }

  }).then((data) => {

    let mail = cm.modules.email.create('contact_msg', 'en', process.env.GMAIL_USER, {
      userId: data.user._id,
      username: data.user.username,
      contactType: data.contactType.label.en,
      number: data.contactType.count + 1,
      contactMsg: action.req.body.contactMsg
    });

    cm.modules.email.send(mail, (err) => {

      if (!err) {

        data.contactType.count += 1;
        data.contactType.save();

        action.end(200, {
          msg: {
            title: data.user.username,
            info: cm.hardData[action.req.session.language].msgs.infos[4]
          }
        });

      } else { action.end(400, err); }
    });
  });
};