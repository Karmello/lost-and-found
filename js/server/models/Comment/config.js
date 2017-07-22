const cm = require(global.paths.server + '/cm');

module.exports = {
	get: {
		max: 5
	},
	content: {
		length: { max: 1000 }
	}
};