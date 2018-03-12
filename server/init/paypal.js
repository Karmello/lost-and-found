const cm = require(global.paths.server + '/cm');

module.exports = () => {

  return new cm.libs.Promise((resolve) => {

    cm.libs.paypal.configure({
      'host': 'api.sandbox.paypal.com',
      'port': '',
      'client_id': process.env.PAYPAL_CLIENT_ID,
      'client_secret': process.env.PAYPAL_CLIENT_SECRET
    });

    resolve();
  });
};