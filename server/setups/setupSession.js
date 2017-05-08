var r = require(global.paths._requires);

module.exports = function(app, cb) {

    var sessionStore = new r.MongoStore({ mongooseConnection: r.mongoose.connection });

    // On session created
    sessionStore.on('create', function(sid) {

        // Getting session object
        sessionStore.get(sid, function(err, session) {

            // Preparing session object
            session.language = global.app.get('DEFAULT_LANG');
            session.theme = global.app.get('DEFAULT_THEME');
            session.badActionsCount = { login: 0, register: 0, recover: 0, max: global.app.get('CAPTCHA_MAX_BAD_ACTIONS') };

            sessionStore.set(sid, session);
        });
    });

    app.use(r.session({
        name: 'auction_house.sid',
        secret: process.env.AUTH_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized: true
    }));

    cb();
};