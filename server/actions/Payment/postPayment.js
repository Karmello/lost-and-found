var r = require(global.paths._requires);

module.exports = {
	before: function(req, res, next) {

		var action = new r.prototypes.Action(arguments);

		new r.Promise(function(resolve, reject) {

			action.req.body.userId = action.req.decoded._doc._id;
			var newPayment = new r.Payment(action.req.body);

			// Validating form data

			newPayment.validate(function(err) {

				// Form data valid
				if (!err) {

					// Getting payment config
					var paymentConfig = r.modules.paypalModule.createPaymentConfig(action, newPayment);

					// Creating paypal payment object
					r.paypal.payment.create(paymentConfig, function(err, payment) {

						if (!err) {

							req.session.paymentId = payment.id;

							// Distinguishing between payment methods
							switch (payment.payer.payment_method) {

								case 'credit_card':

									r.modules.paypalModule.makeCreditCardPayment(payment).then(function() {
										r.modules.paypalModule.finalizePayment(req).then(function() {
											resolve();

										}, function(err) { reject(err); });

									}, function(err) { reject(err); });

									break;

								case 'paypal':

									for (var i = 0; i < payment.links.length; i++) {
										if (payment.links[i].method === 'REDIRECT') {
											return resolve({ url: payment.links[i].href });
										}
									}

									break;
							}

						} else { reject(err); }
					});

				} else { reject(err); }
			});

		}).then(function(data) {

			action.end(200, data);

		}, function(err) {

			action.end(400, err);
		});
	}
};