module.exports = {
  validatePaymentAction: (req, res, next) => {

    switch (req.method) {

      case 'GET':

        if (req.query.userId != req.decoded._id) {
          return res.status(401).send('PAYMENT_' + req.method + '_NOT_ALLOWED');
        }

        break;
    }

    next();
  }
};