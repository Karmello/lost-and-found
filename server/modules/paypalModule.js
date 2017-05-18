var r = require(global.paths._requires);

module.exports = {
	execute: function(req, res) {

	    r.paypal.payment.execute(req.session.paymentId, { payer_id: req.query.PayerID }, function (err, payment) {

	        if (!err) {

	        	var newPayment = new r.Payment({
	        		paymentId: req.session.paymentId,
	        		paymentMethod: payment.payer.payment_method,
	        		currency: payment.transactions[0].amount.currency,
	        		amount: payment.transactions[0].amount.total,
	        		userId: payment.transactions[0].description
	        	});

	        	if (newPayment.paymentMethod == 'credit_card') {
	        		newPayment.creditCardType = payment.funding_instruments[0].credit_card.type;
	        		newPayment.creditCardNumber = payment.funding_instruments[0].credit_card.number;
	        		newPayment.creditCardExpireMonth = payment.funding_instruments[0].credit_card.expire_month;
	        		newPayment.creditCardExpireYear = payment.funding_instruments[0].credit_card.expire_year;
	        		newPayment.cvv2 = payment.funding_instruments[0].credit_card.cvv2;
	        		newPayment.firstname = payment.funding_instruments[0].credit_card.first_name;
	        		newPayment.last_name = payment.funding_instruments[0].credit_card.last_name;
	        	}

	        	newPayment.save(function(err) {

	        		if (!err) {

	        			r.User.findOne({ _id: payment.transactions[0].description }, function(err, user) {

			                if (!err && user) {
			                    user.account = 'full';
			                    user.save({ validateBeforeSave: false }, function(err) {
			                        if (!err) { res.redirect('http://' + req.headers.host + '/#/upgrade'); } else { res.send('Error occured.'); }
			                    });

			                } else { res.send('Error occured.'); }
			            });

	        		} else { res.send('Error occured.'); }
	        	});

	        } else { res.send('Error occured.'); }
	    });
	}
};