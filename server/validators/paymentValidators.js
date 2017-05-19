var r = require(global.paths._requires);

module.exports = {
    method: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function (method) {

                for (var i = 0; i < r.hardData.en.payment.methods.length; i++) {
                    if (r.hardData.en.payment.methods[i].value == method) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    currency: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function (currency) {

                for (var i = 0; i < r.hardData.en.payment.currencies.length; i++) {
                    if (r.hardData.en.payment.currencies[i].value == currency) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    creditCardType: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function (creditCardType) {

                var creditCardTypes = Object.keys(r.hardData.en.payment.creditCardTypes);

                for (var i = 0; i < creditCardTypes.length; i++) {
                    if (creditCardTypes[i] == creditCardType) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    creditCardNumber: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function(creditCardNumber) {

                return /^[0-9]{12,19}$/.test(creditCardNumber);
            }
        }
    },
    creditCardExpireMonth: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function(creditCardExpireMonth) {

                return /^(0?[1-9]|1[012])$/.test(creditCardExpireMonth);
            }
        }
    },
    creditCardExpireYear: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function(creditCardExpireYear) {

                return /^[0-9]{4}$/.test(creditCardExpireYear);
            }
        }
    },
    cvv2: {
        correctness: {
            type: 'incorrect',
            msgIndex: 2,
            validator: function(cvv2) {

                return /^[0-9]{3,4}$/.test(cvv2);
            }
        }
    }
};