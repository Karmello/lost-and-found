var r = require(global.paths.server + '/requires');

module.exports = {
    string: {
        no_special_chars: {
            type: 'special_chars_found',
            validator: function(string) {

                var regex = /([\`\-\=\[\]\\\;\'\,\.\/\~\!\@\#\$\%\^\&\*\(\)\+\{\}\|\:\"<\>\?\_])/;
                if (string.search(regex) != -1) { return false; } else { return true; }
            }
        },
        no_digits: {
            type: 'digits_found',
            validator: function(string) {

                if (string.search(/\d/) != -1) { return false; } else { return true; }
            }
        },
        no_multiple_words: {
            type: 'multiple_words_found',
            validator: function(string) {

                if (string.search(/([\ ])/) != -1) { return false; } else { return true; }
            }
        }
    },
    number: {
        is_integer: {
            type: 'not_integer',
            validator: function(number) {

                return Number.isInteger(number);
            }
        },
        is_positive: {
            type: 'not_positive',
            validator: function(number) {

                return number > 0;
            }
        },
        is_not_negative: {
            type: 'negative',
            validator: function(number) {

                return number >= 0;
            }
        }
    }
};