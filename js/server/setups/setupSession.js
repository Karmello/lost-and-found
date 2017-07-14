var r = require(global.paths.server + '/requires');

module.exports = function(cb) {

    let app = global.app;

    var sessionStore = new r.MongoStore({ mongooseConnection: r.mongoose.connection });

    // On session created
    sessionStore.on('create', function(sid) {

        // Getting session object
        sessionStore.get(sid, function(err, session) {

            // Preparing session object
            session.language = app.get('DEFAULT_LANG');
            session.theme = app.get('DEFAULT_THEME');
            session.badActionsCount = { login: 0, register: 0, recover: 0, max: app.get('CAPTCHA_MAX_BAD_ACTIONS') };

            sessionStore.set(sid, session);
        });
    });

    app.use(r.session({
        name: 'laf.sid',
        secret: process.env.AUTH_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: true
    }));

    cb();
};