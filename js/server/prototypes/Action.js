const cm = require(global.paths.server + '/cm');

let Action = function(args) {

	this.req = args[0];
	this.res = args[1];
	this.next = args[2];

	if (this.req.query && this.req.query.action) {
		this.id = this.req.query.action;
	}
};

Action.prototype.setAsBad = function() {
	this.req.session.badActionsCount[this.id] += 1;
};

Action.prototype.resetBadCount = function() {
	this.req.session.badActionsCount[this.id] = 0;
};

Action.prototype.end = function(status, body) {

	let that = this;

	try {
		that.res.status(status).send(body);

	} catch(ex) {} finally {

		if (process.env.NODE_ENV == 'testing' || process.env.NODE_ENV == 'setup') { that.next(body); }
	}
};

module.exports = Action;