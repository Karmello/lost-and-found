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

                        if (decoded._id) { query = { _id: decoded._id }; }
                        else if (decoded.username) { query = { username: decoded.username }; }
                        else if (decoded.email) { query = { email: decoded.email }; }

                        // Looking for user with token credentials
                        r.User.count(query, function(err, count) {

                            // User found
                            if (!err && count == 1) {

                                req.decoded = decoded;
                                next();

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

                if (req.params.id != req.decoded._id) {
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

                if (req.body.userId != req.decoded._id) {
                    return res.status(401).send('REPORT_' + req.method + '_NOT_ALLOWED');
                }

                break;

            case 'DELETE':

                if (req.query.userId != req.decoded._id) {
                    return res.status(401).send('REPORT_' + req.method + '_NOT_ALLOWED');
                }

                break;
        }

        next();
    },
    paymentAction: function(req, res, next) {

        switch (req.method) {

            case 'GET':

                if (req.query.userId != req.decoded._id) {
                    return res.status(401).send('PAYMENT_' + req.method + '_NOT_ALLOWED');
                }

                break;
        }

        next();
    },
    captcha: function(action) {

        return new r.Promise(function(resolve) {

            if (!action.req.session.badActionsCount) {
                return action.end(500, 'NO_BAD_ACTIONS_COUNT_OBJECT');
            }

            // No need for verification
            if (action.req.session.badActionsCount[action.id] <= action.req.session.badActionsCount.max) {
                resolve();

            // Captcha needs to be verified
            } else {

                if (action.req.headers.captcha_response) {

                    var post_data = r.querystring.stringify({
                        secret: process.env.GRECAPTCHA_KEY,
                        response: action.req.headers.captcha_response
                    });

                    var post_options = {
                        host: 'www.google.com',
                        port: '443',
                        path: '/recaptcha/api/siteverify',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': post_data.length
                        }
                    };

                    var post_req = r.https.request(post_options, function(post_res) {

                        post_res.setEncoding('utf8');

                        post_res.on('data', function (data) {

                            if (JSON.parse(data).success) {
                                resolve();

                            } else {
                                action.setAsBad();
                                action.end(403, 'CAPTCHA_SOLVE_ERROR');
                            }

                        });
                    });

                    post_req.write(post_data);
                    post_req.end();

                } else {

                    action.setAsBad();
                    action.end(400, 'NO_CAPTCHA_RESPONSE_PROVIDED');
                }
            }
        });
    }
};