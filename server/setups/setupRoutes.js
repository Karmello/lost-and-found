var r = require(global.paths._requires);

module.exports = function(app, dirname, cb) {

    // Registering route models
    app.models = require(global.paths.server + 'models');
    var apiRoutes = require('./../routes');
    r._.each(apiRoutes, function(controller, apiRoute) {
        app.use('/api' + apiRoute, controller(app, '/api' + apiRoute));
    });

    // Route serving main page
    app.get('/', function(req, res, next) {
        res.sendFile(dirname + '/public/index.html');
    });

    // Route returning session settings
    app.get('/session', function(req, res) {
        res.send(req.session);
    });

    // Paypal
    app.get('/paypal/execute', r.modules.paypalModule.makePaypalPayment);
    app.get('/paypal/cancel', function(req, res) { res.redirect('http://' + req.headers.host + '/#/upgrade'); });
    app.get('/paypal/payment', [r.modules.authorize.userToken, r.modules.paypalModule.getPaymentDetails]);

    // Get stats route
    app.get('/stats', r.actions.other.getStats);

    // Password recovering
    app.post('/recover', r.actions.password.recover);

    // Pasword resetting
    app.get('/reset_password', [r.modules.authorize.userToken, r.actions.password.reset]);

    // AWS3 upload credentials
    app.post('/get_aws3_upload_credentials', [r.modules.authorize.userToken, r.modules.aws3Module.get_upload_credentials]);

    // Static files
    if (process.env.NODE_ENV !== 'production') {
        app.use('/public', r.express.static(dirname + '/unminified'));

    } else {
        app.use('/public', r.express.static(dirname + '/minified'));
    }

    app.use('/public', r.express.static(dirname + '/public'));
    app.use('/node_modules', r.express.static(dirname + '/node_modules'));

    cb();
};