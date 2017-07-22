const cm = require(global.paths.server + '/cm');

module.exports = (modelName, propName, validatorName) => {

	let validator;

	switch (validatorName) {

		case 'correctness':
			validator = { type: 'incorrect' };
			break;

		case 'uniqueness':
			validator = { type: 'not_unique' };
			break;
	}

	let path = global.paths.server + '/models/' + modelName + '/validators';

	validator.validator = require(path)[propName][validatorName];
	return validator;
};