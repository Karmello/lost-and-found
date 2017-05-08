(function() {

	var Response = function() {};

	Response.prototype.status = function(code) {
		this.code = code;
		return this;
	};

	Response.prototype.send = function(body) {
		this.body = body;
		return this;
	};

	module.exports = Response;

})();