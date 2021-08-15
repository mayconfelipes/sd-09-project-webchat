// const allMessages = []; // ->fazer sabe de mensagens em memoria

const server = (io) => {
  io.on('connection', (sockets) => {    
    // when user is connected "send him" to the others.
    sockets.on('userConnected', () => {
      sockets.emit('generateUser', sockets.id);
    });

    sockets.on('sendUserToOthers', (id) => {
      sockets.broadcast.emit('userToBotton', id);
    });

    sockets.on('disconnect', () => {
      sockets.broadcast.emit('userDisconnected', sockets.id);
    });
  });
};

module.exports = server;
