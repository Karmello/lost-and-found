var r = require(global.paths._requires);

module.exports = function(cb) {

    r.paypal.configure({
        'host': 'api.sandbox.paypal.com',
        'port': '',
        'client_id': process.env.PAYPAL_CLIENT_ID,
        'client_secret': process.env.PAYPAL_CLIENT_SECRET
    });

    cb();
};