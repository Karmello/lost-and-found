var r = require(global.paths._requires);

module.exports = {
    userToken: function(req, res, next) {

        var action = new r.prototypes.Action(arguments);

        try {

            var token = req.body.authToken || req.query.authToken || req.headers['x-access-token'];

            // Got token
            if (token) {

                // Verifying token
                r.jwt.verify(token, process.env.AUTH_SECRET, function(err, decoded) {

                    // Error
                    if (err || !decoded) {
                        action.end(400, 'TOKEN_AUTHENTICATION_FAILED');

                    // Token ok
                    } else {

                        var query;

                        if (decoded._doc._id) { query = { _id: decoded._doc._id }; }
                        else if (decoded._doc.username) { query = { username: decoded._doc.username }; }
                        else if (decoded._doc.email) { query = { email: decoded._doc.email }; }

                        // Looking for user with token credentials
                        r.User.findOne(query, function(err, user) {

                            // User found
                            if (!err && user) {

                                // Getting user's app config
                                r.AppConfig.findOne({ userId: user.id }, function(err, appConfig) {

                                    // Token veryfication successful
                                    if (!err && appConfig) {

                                        delete decoded._doc.password;

                                        req.decoded = decoded;
                                        req.session.language = appConfig.language;
                                        req.session.theme = appConfig.theme;
                                        next();

                                    } else { action.end(500, err); }
                                });

                            // No user found
                            } else { action.end(400, 'USER_NOT_FOUND'); }
                        });
                    }
                });

            // No token was provided
            } else { action.end(400, 'NO_TOKEN_PROVIDED'); }

        } catch(ex) { action.end(500, ex); }
    },
    userAction: function(req, res, next) {

        switch (req.method) {

            case 'PUT':
            case 'DELETE':

                if (req.params.id != req.decoded._doc._id) {
                    return res.status(401).send('USER_' + req.method + '_NOT_ALLOWED');
                }

                break;
        }

        next();
    },
    reportAction: function(req, res, next) {

        switch (req.method) {

            case 'POST':
            case 'PUT':

                if (req.body.userId != req.decoded._doc._id) {
                    return res.status(401).send('REPORT_' + req.method + '_NOT_ALLOWED');
                }

                break;

            case 'DELETE':

                if (req.query.userId != req.decoded._doc._id) {
                    return res.status(401).send('REPORT_' + req.method + '_NOT_ALLOWED');
                }

                break;
        }

        next();
    }
};