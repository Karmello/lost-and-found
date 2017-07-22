const cm = require(global.paths.server + '/cm');

module.exports = {
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
};