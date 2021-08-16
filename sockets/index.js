const message = require('./message');

module.exports = (io) => io.on(
  'connection',
  (socket) => {
    message(io, socket);
  },
);