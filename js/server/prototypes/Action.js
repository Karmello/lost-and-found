var r = require(global.paths.server + '/requires');

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

	try { that.res.status(status).send(body); } catch(ex) {} finally {
		if (process.env.NODE_ENV == 'testing') { that.next(body); }
	}
};

module.exports = Action;