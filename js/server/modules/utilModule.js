module.exports = {
	printFormattedLog: function(log) {

		if (process.env.NODE_ENV != 'testing') {

			var sign = '-';
			var line = sign;

			for (var i = 0; i < log.length; i++) { line += sign; }
			line += sign;

			console.log(line);
			console.log(' ' + log);
			console.log(line);
		}
	}
};