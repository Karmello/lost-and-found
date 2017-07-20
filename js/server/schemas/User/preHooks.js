const cm = require(global.paths.server + '/cm');

module.exports = {
	validate: function(next) {
		cm.modules.modelDataModule.trimStrings(this, () => { next(); });
	},
	save: function(next) {
		this.hashPassword(() => { next(); });
	}
};