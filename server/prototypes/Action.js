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

Action.prototype.bindValErrMsgs = function(err, cb) {

	var lang = this.req.session.language;

	return new r.Promise(function(resolve) {

		if (err && err.name == 'ValidationError') {

			for (var property in err.errors) {

				console.log(property);

				if (err.errors[property].kind == 'required') {
					err.errors[property].message = r.hardData[lang].validation[0];

				} else {

					var msgIndex = err.errors[property].properties.msgIndex;
					err.errors[property].message = r.hardData[lang].validation[msgIndex];

					if (err.errors[property].properties.getIntervalMsg) {
						err.errors[property].message += ' ' + err.errors[property].properties.getIntervalMsg();
					}
				}
			}

			resolve();

		} else { resolve(); }
	});
};

Action.prototype.end = function(status, body) {

	var that = this;

	that.bindValErrMsgs(body).then(function() {
		that.res.status(status).send(body);
		if (process.env.NODE_ENV == 'testing') { that.next(); }
	});
};

module.exports = Action;