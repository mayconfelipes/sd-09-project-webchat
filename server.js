const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const PORT = 3000; 

const io = require('socket.io')(http, {
    cors: {
        origin: 'https://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.use(express.static(`${__dirname}/web`));

require('./sockets/webChat')(io);

app.get('/', (_req, res) => {
    res.sendFile(`${__dirname}/web/index.html`);
});

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});