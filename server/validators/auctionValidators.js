var r = require(global.paths._requires);
var hardData = require(global.paths.json + 'hard_coded/hard_coded_en.json');

module.exports = {
    currency: {
        correctness: {
            type: 'incorrect',
            msgIndex: 1,
            validator: function(currency) {

                for (var i = 0; i < hardData.currencies.length; i++) {
                    if (hardData.currencies[i].value == currency) { return true; }
                }

                return false;
            }
        }
    },
    minSellPrice: {
        gtInitialValue: {
            type: 'not_gt_initial_value',
            msgIndex: 12,
            validator: function(minSellPrice) {

                return minSellPrice > this.initialValue;
            }
        }
    }
};