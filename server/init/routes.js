const cm = require(global.paths.server + '/cm');

module.exports = () => {

  return new cm.libs.Promise((resolve, reject) => {
    try {

      let app = cm.app;

      // Route for app setups
      if (process.env.NODE_ENV === 'development') {
        app.post('/setup', require(global.paths.root + '/mockup/setup/onRequest'));
      }

      // Registering route models
      app.models = require(global.paths.server + '/models/models');

      let controllers = require(global.paths.server + '/models/controllers');

      cm.libs._.each(controllers, (controller, route) => {
        app.use('/api' + route, controller(app, '/api' + route));
      });

      // Route serving main page
      app.get('/', (req, res) => { res.sendFile(global.paths.root + '/public/templates/index.html'); });

      // Route returning session settings
      app.get('/session', (req, res) => { res.send(req.session); });

      // Paypal
      app.get('/paypal/execute', cm.modules.paypal.makePaypalPayment);
      app.get('/paypal/cancel', (req, res) => { res.redirect('https://' + req.headers.host + '/#/upgrade'); });
      app.get('/paypal/payment', [cm.User.authenticateToken, cm.modules.paypal.getPaymentDetails]);

      // Get stats route
      app.get('/stats', cm.actions.getStats);

      // Password recovering
      app.post('/recover', cm.actions.password.recover);

      // Pasword resetting
      app.get('/reset_password', [cm.User.authenticateToken, cm.actions.password.reset]);

      // AWS3 upload credentials
      app.post('/get_aws3_upload_credentials', [cm.User.authenticateToken, cm.modules.aws3.getUploadCredentials]);

      // Static files
      if (process.env.NODE_ENV !== 'production') {
        app.use('/public', cm.libs.express.static(global.paths.root + '/public/unminified'));

      } else {
        app.use('/public', cm.libs.express.static(global.paths.root + '/public/minified'));
      }

      app.use('/public', cm.libs.express.static(global.paths.root + '/public'));
      app.use('/node_modules', cm.libs.express.static(global.paths.root + '/node_modules'));

      resolve();

    } catch(ex) { reject(ex); }
  });
};