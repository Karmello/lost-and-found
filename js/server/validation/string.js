const cm = require(global.paths.server + '/cm');

module.exports = {
    noSpecialChars: {
        type: 'special_chars_found',
        validator: function(string) {

            let regex = /([\`\-\=\[\]\\\;\'\,\.\/\~\!\@\#\$\%\^\&\*\(\)\+\{\}\|\:\"<\>\?\_])/;
            if (string.search(regex) != -1) { return false; } else { return true; }
        }
    },
    noDigits: {
        type: 'digits_found',
        validator: function(string) {

            if (string.search(/\d/) != -1) { return false; } else { return true; }
        }
    },
    noMultipleWords: {
        type: 'multiple_words_found',
        validator: function(string) {

            if (string.search(/([\ ])/) != -1) { return false; } else { return true; }
        }
    }
};