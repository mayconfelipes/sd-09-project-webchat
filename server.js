const { instrument } = require('@socket.io/admin-ui');
const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const PORT = 3000; 

const io = require('socket.io')(http, {
    cors: {
        origin: ['http://localhost:3000', 'http://admin.socket.io/'],
        methods: ['GET', 'POST'],
    },
});

app.use(express.static(`${__dirname}/web`));

require('./sockets/webChat')(io);

app.get('/', (_req, res) => {
    res.sendFile(`${__dirname}/web/index.html`);
});

instrument(io, { auth: false });

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});