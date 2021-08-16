const moment = require('moment');
const Message = require('../models/message');

let users = [];

const updateNick = (socket, nickname) => {
    const user = users.find((s) => s.socket === socket);
    user.nickname = nickname;
};

const addUser = (socket) => {
    const user = { socket, nickname: socket.id.slice(0, 16) };
    users.push(user);

    return user;
};

const disconnect = (io, socket) => {
    users = users.filter((user) => user.socket !== socket);
    io.emit('userlist', users.map((user) => user.nickname));
};

const init = async (io, socket) => {
    const newUser = addUser(socket);

    socket.emit('nickname', newUser.nickname);

    io.emit('userlist', users.map((user) => user.nickname));

    const messages = await Message.find();

    socket.emit('messagehistory', messages
        .map(({ message, nickname, timestamp }) => `${timestamp} - ${nickname}: ${message}`));
};

module.exports = (io) => {
    io.on('connection', async (socket) => {
        init(io, socket);

        socket.on('message', async ({ chatMessage, nickname }) => {
            const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
            await Message.create({ message: chatMessage, nickname, timestamp });
            io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
        });

        socket.on('updatenick', (nickname) => {
            const user = users.find((s) => s.socket === socket);
            io.emit('updatenick', { oldNickname: user.nickname, newNickname: nickname });
            updateNick(socket, nickname);
        });

        socket.on('disconnect', () => disconnect(io, socket));
    });
};