const cm = require(global.paths.server + '/cm');

module.exports = {
	paymentMethod: {
        correctness: function(method) {
            let methods = Object.keys(cm.hardData.en.payment.methods);
            for (let i = 0; i < methods.length; i++) { if (methods[i] == method) { return true; } }
            return false;
        },
    },
    currency: {
        correctness: function(currency) {

            for (let i = 0; i < cm.hardData.en.payment.currencies.length; i++) {
                if (cm.hardData.en.payment.currencies[i].value == currency) { return true; }
            }

            return false;
        }
    },
    creditCardType: {
        correctness: function(creditCardType) {

            let creditCardTypes = Object.keys(cm.hardData.en.payment.creditCardTypes);

            for (let i = 0; i < creditCardTypes.length; i++) {
                if (creditCardTypes[i] == creditCardType) { return true; }
            }

            return false;
        },
    },
    creditCardNumber: {
        correctness: function(creditCardNumber) {
            return /^[0-9]{12,19}$/.test(creditCardNumber);
        },
    },
    creditCardExpireMonth: {
        correctness: function(creditCardExpireMonth) {
            return /^(0?[1-9]|1[012])$/.test(creditCardExpireMonth);
        },
    },
    creditCardExpireYear: {
        correctness: function(creditCardExpireYear) {
            return /^[0-9]{4}$/.test(creditCardExpireYear);
        },
    },
    cvv2: {
        correctness: function(cvv2) {
            return /^[0-9]{3,4}$/.test(cvv2);
        }
    }
};