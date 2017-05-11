var r = require(global.paths._requires);

module.exports = function(server, cb) {

    var io = r.io(server);

    io.on('connection', function(socket) {

    });

    cb();
};