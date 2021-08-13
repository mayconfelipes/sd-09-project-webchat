module.exports = (io) => io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('new_message', ({ msg }) => {
        console.log(msg);

        socket.emit('update', msg);
    });
});