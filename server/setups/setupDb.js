var r = require(global.paths._requires);

module.exports = function(cb) {

    r.mongoose.Promise = global.Promise;

    r.mongoose.connection.once('open', function() {
        printConsoleLog('open');
        if (cb) { cb(); }
    });

    r.mongoose.connection.once('error', function() {
        printConsoleLog('error');
        if (cb) { cb(); }
    });

    r.mongoose.connect(process.env.MONGO_URL);
};

var printConsoleLog = function(action) {

    var log = 'MongoDB: [' + action + ']';
    r.modules.utilModule.printFormattedLog(log);
};