const cm = require(global.paths.server + '/cm');

module.exports = {
    string: {
        no_special_chars: {
            type: 'special_chars_found',
            validator: (string) => {

                let regex = /([\`\-\=\[\]\\\;\'\,\.\/\~\!\@\#\$\%\^\&\*\(\)\+\{\}\|\:\"<\>\?\_])/;
                if (string.search(regex) != -1) { return false; } else { return true; }
            }
        },
        no_digits: {
            type: 'digits_found',
            validator: (string) => {

                if (string.search(/\d/) != -1) { return false; } else { return true; }
            }
        },
        no_multiple_words: {
            type: 'multiple_words_found',
            validator: (string) => {

                if (string.search(/([\ ])/) != -1) { return false; } else { return true; }
            }
        }
    },
    number: {
        is_integer: {
            type: 'not_integer',
            validator: (number) => {

                return Number.isInteger(number);
            }
        },
        is_positive: {
            type: 'not_positive',
            validator: (number) => {

                return number > 0;
            }
        },
        is_not_negative: {
            type: 'negative',
            validator: (number) => {

                return number >= 0;
            }
        }
    }
};