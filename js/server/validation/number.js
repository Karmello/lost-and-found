const cm = require(global.paths.server + '/cm');

module.exports = {
    isInteger: {
        type: 'not_integer',
        validator: function(number) {

            return Number.isInteger(number);
        }
    },
    isPositive: {
        type: 'not_positive',
        validator: function(number) {

            return number > 0;
        }
    },
    isNotNegative: {
        type: 'negative',
        validator: function(number) {

            return number >= 0;
        }
    }
};