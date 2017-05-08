var r = require(global.paths._requires);

module.exports = {
    string: {
        no_special_chars: {
            type: 'special_chars_found',
            msgIndex: 5,
            validator: function(string) {

                var regex = /([\`\-\=\[\]\\\;\'\,\.\/\~\!\@\#\$\%\^\&\*\(\)\+\{\}\|\:\"<\>\?\_])/;
                if (string.search(regex) != -1) { return false; } else { return true; }
            }
        },
        no_digits: {
            type: 'digits_found',
            msgIndex: 6,
            validator: function(string) {

                if (string.search(/\d/) != -1) { return false; } else { return true; }
            }
        },
        no_multiple_words: {
            type: 'multiple_words_found',
            msgIndex: 7,
            validator: function(string) {

                if (string.search(/([\ ])/) != -1) { return false; } else { return true; }
            }
        }
    },
    number: {
        is_integer: {
            type: 'not_integer',
            msgIndex: 8,
            validator: function(number) {

                return Number.isInteger(number);
            }
        },
        is_positive: {
            type: 'not_positive',
            msgIndex: 9,
            validator: function(number) {

                return number > 0;
            }
        },
        is_not_negative: {
            type: 'negative',
            msgIndex: 10,
            validator: function(number) {

                return number >= 0;
            }
        }
    }
};