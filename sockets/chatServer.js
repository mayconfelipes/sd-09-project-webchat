const randomstring = require('randomstring');
const UsersModel = require('../models/UsersModel');
const MessagesModel = require('../models/MessagesModel');

const constructMessageMongoObj = ({ nickname, message }) => {
  const timestamp = new Date(Date.now());
  const objMsg = { message, nickname, timestamp };
  return objMsg;
};

const addUserToDataBase = async (socketID, userName) => {
  const userData = await UsersModel.addOneUser(socketID, userName);
  return userData;
};

const findAllUsers = async () => {
  const userData = await UsersModel.findAllUsers();
  return userData;
};

const deleteOneUser = async (id) => {
  const userData = await UsersModel.deleteOneUser(id);
  return userData;
};

const updateOneUser = async (id, name) => {
  await UsersModel.updateOneUser(id, name);
};

const messageSaveData = async (objectMessage) => {
  await MessagesModel.addOneMessage(objectMessage);
};

const getAllMessages = async () => {
  const messages = await MessagesModel.findAllMessages();
  return messages;
};

const generateRandomName = () => randomstring.generate(16);

// ALL sockets functions.
const userConnected = async (socket) => {
  const randonName = generateRandomName();
  const { _id, name } = await addUserToDataBase(socket.id, randonName);
  const arrayOfUsers = await findAllUsers();
  socket.emit('generateUser', { id: _id, name, arrayOfUsers });
};

const userDelete = async (socket) => {
  await deleteOneUser(socket.id);
  socket.broadcast.emit('userDisconnected', socket.id);
};

const userUpdate = async (io, userObj) => {
  const { id, name } = userObj;
  await updateOneUser(id, name);
  io.emit('resolveUserChangeNick', userObj);
};

const messageSend = async (io, msgObj) => {
  const messageMongoObj = constructMessageMongoObj(msgObj);
  await messageSaveData(messageMongoObj);
  io.emit('resolveMessageSend', messageMongoObj);
};

const retrieveMessageList = async (io) => {
  const messagesArray = await getAllMessages();
  io.emit('resolveMessagesList', messagesArray);
};

const server = (io) => {
  io.on('connection', (sockets) => {    
    // when user is connected "send him" to the others.
    sockets.on('userConnected', () => userConnected(sockets));
    sockets.on('sendUserToOthers', (userObj) => sockets.broadcast.emit('userToBotton', userObj));
    sockets.on('disconnect', () => userDelete(sockets));
    sockets.on('requestUserChangeNick', (userObj) => userUpdate(io, userObj));
    sockets.on('requestMessageSend', (msgObj) => messageSend(io, msgObj));
    sockets.on('requestMessagesList', () => retrieveMessageList(io));
  });
};

module.exports = server;
