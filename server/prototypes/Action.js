var r = require(global.paths._requires);

var Action = function(args) {

	this.req = args[0];
	this.res = args[1];
	this.next = args[2];
};

Action.prototype.setAsBad = function() {

	this.req.session.badActionsCount[this.id] += 1;
};

Action.prototype.resetBadCount = function() {

	this.req.session.badActionsCount[this.id] = 0;
};

Action.prototype.end = function(status, body) {

	var that = this;

	that.res.status(status).send(body);
	if (process.env.NODE_ENV == 'testing') { that.next(); }
};

module.exports = Action;