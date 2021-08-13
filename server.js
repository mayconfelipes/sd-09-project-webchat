const express = require('express');

const app = express();
const server = require('http').createServer(app);

server.listen(3000, () => console.log('Conectado na porta 3000'));
