const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const PORT = 3000;

app.use('/', express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));

const io = socketIO(server);

require('./sockets/chat')(io);