const cm = require(global.paths.server + '/cm');

let createGetTokenConfig = () => {

	return {
		uri: 'https://api.sandbox.paypal.com/v1/oauth2/token',
		headers: {
			'Accept': 'application/json',
			'Accept-Language': 'en_US',
			'content-type': 'application/x-www-form-urlencoded'
		},
		auth: {
			'user': process.env.PAYPAL_CLIENT_ID,
			'pass': process.env.PAYPAL_CLIENT_SECRET,
		},
		form: {
			'grant_type': 'client_credentials'
		}

	};
};

module.exports = {
	createPaymentConfig: (action, newPayment) => {

		let config = {
			'intent': 'sale',
			'payer': {
				'payment_method': newPayment.method
			},
			'transactions': [
				{
					'amount': {
						'total': newPayment.amount,
						'currency': newPayment.currency
					},
					'description': action.req.decoded._id
				}
			]
		};

		switch (newPayment.method) {

			case 'credit_card':

				config.payer.funding_instruments = [
					{
						'credit_card': {
							'type': newPayment.creditCard.type,
							'number': newPayment.creditCard.number,
							'first_name': newPayment.creditCard.name.first,
							'last_name': newPayment.creditCard.name.last,
							'expire_month': newPayment.creditCard.expireMonth,
							'expire_year': newPayment.creditCard.expireYear,
							'cvv2': newPayment.creditCard.cvv2
						}
					}
				];

				break;

			case 'paypal':

				config.redirect_urls = {
					'return_url': 'https://' + action.req.headers.host + '/paypal/execute',
					'cancel_url': 'https://' + action.req.headers.host + '/paypal/cancel'
				};

				break;
		}

		return config;
	},
	makeCreditCardPayment: (payment) => {

		// Getting token

		return new cm.libs.Promise((resolve, reject) => {

			cm.libs.request.post(createGetTokenConfig(), (err, res, body) => {

				if (!err) {

					let data = JSON.parse(body);

					// Making payment using token

					cm.libs.request.get({
						uri: payment.links[0].href,
						headers: { 'Authorization': data.token_type + ' ' + data.access_token }

					}, (err, res, body) => {
						if (!err) { resolve(JSON.parse(body)); } else { reject(err); }
					});

				} else { reject(err); }
			});
		});
	},
	makePaypalPayment: (req, res) => {

	    cm.libs.paypal.payment.execute(req.session.paymentId, { payer_id: req.query.PayerID }, (err, payment) => {

	        if (!err) {

	        	cm.modules.paypal.finalizePayment(payment).then(() => {
	        		res.redirect('https://' + req.headers.host + '/#/upgrade?id=' + payment.transactions[0].description);

	        	}, () => {
	        		res.send('Error occured.');
	        	});

	        } else {
	        	res.send('Error occured.');
	        }
	    });
	},
	finalizePayment: (payment) => {

		return new cm.libs.Promise((resolve, reject) => {

			cm.User.findOne({ _id: payment.transactions[0].description }, (err, user) => {

                if (!err && user) {

                    user.paymentId = payment.id;

                    user.save({ validateBeforeSave: false }, (err) => {
                        if (!err) { resolve(); } else { reject(err); }
                    });

                } else { reject(err); }
            });
		});
	},
	getPaymentDetails: (...args) => {

		let action = new cm.prototypes.Action(args);

		return new cm.libs.Promise((resolve, reject) => {

			// Getting user by query userId
			cm.User.findOne({ _id: action.req.decoded._id }, (err, user) => {

				if (!err && user) {

					// Getting token
					cm.libs.request.post(createGetTokenConfig(), (err, res, body) => {

						if (!err) {

							let data = JSON.parse(body);

							// Getting payment details
							cm.libs.request.get({
								uri: 'https://api.sandbox.paypal.com/v1/payments/payment/' + user.paymentId,
								headers: { 'Authorization': data.token_type + ' ' + data.access_token }

							}, (err, res, body) => {
								if (!err) { resolve(JSON.parse(body)); } else { reject(err); }
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then((data) => {

			action.end(200, data);

		}, (err) => {

			action.end(400, err);
		});
	}
};