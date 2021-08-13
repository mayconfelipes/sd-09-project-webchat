const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const { PORT } = process.env;

// const io = require('socket.io')(http, {
//   cors: {
//     origin: 'http://localhost:3000', // url aceita pelo cors
//     methods: ['GET', 'POST'], // Métodos aceitos pela url
//   },
// });

// app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
