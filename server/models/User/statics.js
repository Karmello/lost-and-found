const cm = require(global.paths.server + '/cm');

module.exports = {
  authenticateToken: (...args) => {

    let action = new cm.prototypes.Action(args);

    try {

      let token = action.req.body.authToken || action.req.query.authToken || action.req.headers['x-access-token'];

      // Got token
      if (token) {

        // Verifying token
        cm.libs.jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {

          // Error
          if (err || !decoded) {
            action.end(400, 'TOKEN_AUTHENTICATION_FAILED');

            // Token ok
          } else {
            action.req.decoded = decoded;
            action.next();
          }
        });

        // No token was provided
      } else { action.end(400, 'NO_TOKEN_PROVIDED'); }

    } catch(ex) { action.end(500, ex); }
  },
  authenticateCaptchaRes: (...args) => {

    let action = new cm.prototypes.Action(args);
    if (!action.req.session.badActionsCount) { return action.end(500, 'NO_BAD_ACTIONS_COUNT_OBJECT'); }

    // No need for authentication
    if (action.req.session.badActionsCount[action.id] <= action.req.session.badActionsCount.max) {
      action.next();

      // Captcha needs to be authenticated
    } else {

      if (action.req.headers.captcha_response) {

        let post_data = cm.libs.querystring.stringify({
          secret: process.env.GRECAPTCHA_KEY,
          response: action.req.headers.captcha_response
        });

        let post_options = {
          host: 'www.google.com',
          port: '443',
          path: '/recaptcha/api/siteverify',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
          }
        };

        let post_req = cm.libs.https.request(post_options, (post_res) => {

          post_res.setEncoding('utf8');

          post_res.on('data', (data) => {

            if (JSON.parse(data).success) {
              action.next();

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
  },
  validateUserAction: (req, res, next) => {

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
  emitUsersCount: () => {

    cm.User.count({}, (err, usersCount) => {

      if (!err) {
        cm.io.emit('UpdateAppStats', { usersCount: usersCount });
      }
    });
  }
};