const app = require('express')();
const http = require('http').createServer();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.ejs');
})