const cm = require(global.paths.server + '/cm');

module.exports = {
	get: (modelName, propName, validatorName) => {

		let validator;

		switch (validatorName) {
			case 'correctness': validator = { type: 'incorrect' }; break;
			case 'uniqueness': validator = { type: 'not_unique' }; break;
		}

		let path = global.paths.server + '/models/' + modelName + '/validators';
		validator.validator = require(path)[propName][validatorName];
		return validator;
	},
	length: {
		get: (modelName, propName) => {

			let validator = {
				type: 'wrong_length',
				limits: require(global.paths.server + '/models/' + modelName + '/config')[propName].length
			};

			validator.validator = (() => {

				if (validator.limits.min && validator.limits.max) {
					return function(string) {
						return string.length >= validator.limits.min && string.length <= validator.limits.max;
					};

				} else if (validator.limits.min) {
					return function(string) {
						return string.length >= validator.limits.min;
					};

				} else if (validator.limits.max) {
					return function(string) {
						return string.length <= validator.limits.max;
					};
				}
			})();

			return validator;
		}
	},
	number: {
		isInteger: {
	        type: 'not_integer',
	        validator: function(number) { return Number.isInteger(number); }
	    },
	    isPositive: {
	        type: 'not_positive',
	        validator: function(number) { return number > 0; }
	    },
	    isNotNegative: {
	        type: 'negative',
	        validator: function(number) { return number >= 0; }
	    }
	},
	string: {
		noSpecialChars: {
	        type: 'special_chars_found',
	        validator: function(string) {
	            let regex = /([\`\-\=\[\]\\\;\'\,\.\/\~\!\@\#\$\%\^\&\*\(\)\+\{\}\|\:\"<\>\?\_])/;
	            if (string.search(regex) != -1) { return false; } else { return true; }
	        }
	    },
	    noDigits: {
	        type: 'digits_found',
	        validator: function(string) { if (string.search(/\d/) != -1) { return false; } else { return true; } }
	    },
	    noMultipleWords: {
	        type: 'multiple_words_found',
	        validator: function(string) { if (string.search(/([\ ])/) != -1) { return false; } else { return true; } }
	    }
	}
};