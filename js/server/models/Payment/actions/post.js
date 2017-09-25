const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);
  action.req.body.userId = action.req.decoded._id;

  let newPayment = new cm.Payment(action.req.body);

  newPayment.validate((err) => {

    // Form data valid
    if (!err) {

      // Getting payment config
      let paymentConfig = cm.modules.paypal.createPaymentConfig(action, newPayment);

      // Creating paypal payment object
      cm.libs.paypal.payment.create(paymentConfig, (err, payment) => {

        if (!err) {

          action.req.session.paymentId = payment.id;

          // Distinguishing between payment methods
          switch (payment.payer.payment_method) {

            case 'credit_card':

              cm.modules.paypal.makeCreditCardPayment(payment).then(() => {
                cm.modules.paypal.finalizePayment(payment).then(() => {

                  action.end(200);

                }, (err) => { action.end(400, err); });
              }, (err) => { action.end(400, err); });

              break;

            case 'paypal':

              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].method === 'REDIRECT') {
                  return action.end(200, { url: payment.links[i].href });
                }
              }

              break;
          }

        } else { action.end(400, err); }
      });

    } else { action.end(400, err); }
  });
};