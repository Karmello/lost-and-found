var r = require(global.paths._requires);

module.exports = {
    verify: function(action) {

        return new r.Promise(function(resolve) {

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