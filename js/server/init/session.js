const cm = require(global.paths.server + '/cm');

module.exports = () => {

  return new cm.libs.Promise((resolve) => {

    let app = cm.app;

    let sessionStore = new cm.libs.MongoStore({ mongooseConnection: cm.libs.mongoose.connection });

    // On session created
    sessionStore.on('create', (sid) => {

      // Getting session object
      sessionStore.get(sid, (err, session) => {

        session.language = app.get('DEFAULT_LANG');
        session.theme = app.get('DEFAULT_THEME');

        session.badActionsCount = {
          login: 0,
          register: 0,
          recover: 0,
          max: app.get('CAPTCHA_MAX_BAD_ACTIONS')
        };

        sessionStore.set(sid, session);
      });
    });

    app.use(cm.libs.session({
      name: 'laf.sid',
      secret: process.env.AUTH_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: true
    }));

    resolve();
  });
};