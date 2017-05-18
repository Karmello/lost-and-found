var r = require(global.paths._requires);

var getPaymentConfig = function(action, newPayment) {

	var config = {
		'intent': 'sale',
		'payer': {
			'payment_method': newPayment.paymentMethod
		},
		'transactions': [
			{
				'amount': {
					'total': newPayment.amount,
					'currency': newPayment.currency
				},
				'description': action.req.decoded._doc._id
			}
		]
	};

	switch (newPayment.paymentMethod) {

		case 'credit_card':

			config.payer.funding_instruments = [
				{
					'credit_card': {
						'type': newPayment.creditCardType,
						'number': newPayment.creditCardNumber,
						'first_name': newPayment.firstname,
						'last_name': newPayment.lastname,
						'expire_month': newPayment.creditCardExpireMonth,
						'expire_year': newPayment.creditCardExpireYear,
						'cvv2': newPayment.cvv2
					}
				}
			];

			break;

		case 'paypal':

			config.redirect_urls = {
				'return_url': 'http://' + action.req.headers.host + '/paypal/execute',
				'cancel_url': 'http://' + action.req.headers.host + '/paypal/cancel'
			};

			break;
	}

	return config;
};

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			action.req.body.userId = action.req.decoded._doc._id;
			var newPayment = new r.Payment(action.req.body);

			newPayment.validate(function(err) {

				if (err && newPayment.paymentMethod == 'paypal') {
					delete err.errors.creditCardType;
					delete err.errors.creditCardNumber;
					delete err.errors.firstname;
					delete err.errors.lastname;
					delete err.errors.creditCardExpireMonth;
					delete err.errors.creditCardExpireYear;
					delete err.errors.cvv2;
					if (Object.keys(err.errors).length === 0) { err = null; }
				}

				if (!err) {

					r.paypal.payment.create(getPaymentConfig(action, newPayment), function(err, payment) {

						if (!err) {

							if (payment.payer.payment_method === 'paypal') {

								req.session.paymentId = payment.id;

								for (var i = 0; i < payment.links.length; i++) {
									if (payment.links[i].method === 'REDIRECT') {
										return resolve(payment.links[i].href);
									}
								}
							}

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(url) {

			action.end(200, { redirectUrl: url });

		}, function(err) {

			action.end(400, err);
		});
	}
};