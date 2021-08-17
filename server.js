const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const { chatController } = require('./controller/chatController');
const { formatMessage, getFullDate } = require('./utils');
const { saveMessage } = require('./models/messages');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/views')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', chatController);

const server = app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));

const io = socketIO(server);

let onlineUsers = [];
// getAllMessages().then((res) => console.log(res));
const socketOn = {
    message: ({ chatMessage, nickname }) => {
        console.log(nickname);
        const date = getFullDate();
        const messageFormated = formatMessage(date, nickname, chatMessage);
        saveMessage(chatMessage, nickname, date);
        io.emit('message', messageFormated);
    },

    updateNick: (socket) => (({ newNick, id }) => {
        const response = onlineUsers.map((user) => {
            if (socket.id.includes(user.id)) return { name: newNick, id };
            return user;
        });
        onlineUsers = response;
        io.emit('updateOnlineUsers', response);
    }),
};

io.on('connection', (socket) => {
    console.log('new connection');
    const newUser = {
        id: socket.id.slice(0, 16),
        name: '',
    };
    
    onlineUsers.push(newUser);
    
    io.emit('updateOnlineUsers', onlineUsers);
    
    socket.on('message', socketOn.message);

    socket.on('updateNick', socketOn.updateNick(socket));
});