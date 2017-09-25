const cm = require(global.paths.server + '/cm');

module.exports = () => {
  return new cm.libs.Promise((resolve) => {

    let app = cm.app;

    app.set('CAPTCHA_MAX_BAD_ACTIONS', 5);
    app.set('DEFAULT_LANG', 'en');
    app.set('DEFAULT_THEME', 'standard');
    app.set('AUTH_TOKEN_EXPIRES_IN', 86400);
    app.set('PHOTO_MAX_SIZE', 1048576);

    resolve();
  });
};