const cm = require(global.paths.server + '/cm');

module.exports = (server) => {

  return new cm.libs.Promise((resolve, reject) => {

    try {

      let sockets = {};
      cm.io = cm.libs.socketIO(server);

      cm.io.on('connection', (socket) => {

        console.log('new socket connected', socket.request._query.userId);

        socket.on('disconnect', () => {
          delete sockets[socket.request._query.userId];
          console.log('socket disconnected', socket.request._query.userId);
        });

        socket.on('joinRoom', (room) => {
          console.log('new socket joined room ' + room);
          socket.join(room);
        });

        socket.on('leaveRoom', (room) => {
          console.log('socket left room ', socket.request._query.userId);
          socket.leave(room);
        });

        sockets[socket.request._query.userId] = socket;
      });

      resolve();

    } catch(ex) { reject(ex); }
  });
};