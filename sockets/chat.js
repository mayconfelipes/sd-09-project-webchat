const moment = require('moment');
const { postMessage, getMessage } = require('../services/messages');

let users = [];

const timestamp = moment().format('DD-MM-yyyy HH:mm:ss');
module.exports = (io) => io.on('connection', async (socket) => {
    const defaultNickname = `${socket.id.slice(0, 16)}`;
   users.push({ id: socket.id, nickname: defaultNickname }); 
   socket.emit('defaultNickName', defaultNickname); io.emit('listUsers', users);
    socket.on('updateNick', (x) => {
         const findId = users.findIndex((obj) => obj.nickname === defaultNickname);
         users[findId].nickname = x; io.emit('listUsers', users);
     });
     const historyMessages = await getMessage();
     socket.emit('historyChat', historyMessages);
    socket.on('message', ({ chatMessage, nickname }) => {
        io.emit('message', `${timestamp}- ${nickname}: ${chatMessage}`);
        const message = { nickname, message: chatMessage, timestamp }; postMessage(message);
    });
    socket.on('disconnect', () => {
        users = users.filter((item) => item.id !== socket.id);
        io.emit('message', `O usuário ${socket.id} acabou de se desconectar!`);
        io.emit('listUsers', users);
});
});