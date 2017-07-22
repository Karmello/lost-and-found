const cm = require(global.paths.server + '/cm');

module.exports = {
    isInteger: {
        type: 'not_integer',
        validator: (number) => {

            return Number.isInteger(number);
        }
    },
    isPositive: {
        type: 'not_positive',
        validator: (number) => {

            return number > 0;
        }
    },
    isNotNegative: {
        type: 'negative',
        validator: (number) => {

            return number >= 0;
        }
    }
};