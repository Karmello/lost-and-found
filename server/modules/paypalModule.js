var r = require(global.paths._requires);

module.exports = {
	createPaymentConfig: function(action, newPayment) {

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
					'description': action.req.decoded._id
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
	},
	createGetTokenConfig: function() {

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
	},
	getPaymentDetails: function(req, res) {

		var action = new r.prototypes.Action(arguments);

		return new r.Promise(function(resolve, reject) {

			// Getting user by query userId
			r.User.findOne({ _id: req.decoded._id }, function(err, user) {

				if (!err && user) {

					// Getting token
					r.request.post(r.modules.paypalModule.createGetTokenConfig(), function(err, res, body) {

						if (!err) {

							var data = JSON.parse(body);

							// Getting payment details
							r.request.get({
								uri: 'https://api.sandbox.paypal.com/v1/payments/payment/' + user.paymentId,
								headers: { 'Authorization': data.token_type + ' ' + data.access_token }

							}, function(err, res, body) {

								if (!err) { resolve(JSON.parse(body)); } else { reject(err); }
							});

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {

			action.end(200, data);

		}, function(err) {

			action.end(400, err);
		});
	},
	makeCreditCardPayment: function(payment) {

		// Getting token

		return new r.Promise(function(resolve, reject) {

			r.request.post(r.modules.paypalModule.createGetTokenConfig(), function(err, res, body) {

				if (!err) {

					var data = JSON.parse(body);

					// Making payment using token

					r.request.get({
						uri: payment.links[0].href,
						headers: { 'Authorization': data.token_type + ' ' + data.access_token }

					}, function(err, res, body) {

						if (!err) { resolve(JSON.parse(body)); } else { reject(err); }
					});

				} else { reject(err); }
			});
		});
	},
	makePaypalPayment: function(req, res) {

	    r.paypal.payment.execute(req.session.paymentId, { payer_id: req.query.PayerID }, function (err, payment) {

	        if (!err) {

	        	r.modules.paypalModule.finalizePayment(payment).then(function() {
	        		res.redirect('http://' + req.headers.host + '/#/upgrade?id=' + payment.transactions[0].description);

	        	}, function() {
	        		res.send('Error occured.');
	        	});

	        } else {
	        	res.send('Error occured.');
	        }
	    });
	},
	finalizePayment: function(payment) {

		return new r.Promise(function(resolve, reject) {

			r.User.findOne({ _id: payment.transactions[0].description }, function(err, user) {

                if (!err && user) {

                    user.paymentId = payment.id;

                    user.save({ validateBeforeSave: false }, function(err) {
                        if (!err) { resolve(); } else { reject(err); }
                    });

                } else { reject(err); }
            });
		});
	}
};