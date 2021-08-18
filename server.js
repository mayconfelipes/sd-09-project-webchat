const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());

const ioWebChat = require('./socket/webchat');

ioWebChat(io);

const webchatController = require('./controller/webchat');

app.get('/', webchatController.getMessages);

const PORT = 3000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Academic Honesty:
// Consulted repositories: https://github.com/tryber/sd-05-project-webchat/pull/8/files 
// https://github.com/tryber/sd-09-project-webchat/pull/60/files
// Consulted content: https://www.youtube.com/watch?v=-jXfKDYJJvo