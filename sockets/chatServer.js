const randomstring = require('randomstring');
const UsersModel = require('../models/UsersModel');

const constructUser = (id, name) => ({ id, name });

const addUserToDataBase = async (user) => {
  const userData = await UsersModel.addOneUser(user);
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

const generateRandomName = () => randomstring.generate(16);

// ALL sockets functions.
const userConnected = async (socket) => {
  const randonName = generateRandomName();
  const newUser = constructUser(socket.id, randonName);
  const { id, name } = await addUserToDataBase(newUser);
  const arrayOfUsers = await findAllUsers();
  socket.emit('generateUser', { id, name, arrayOfUsers });
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

const server = (io) => {
  io.on('connection', (sockets) => {    
    // when user is connected "send him" to the others.
    sockets.on('userConnected', () => userConnected(sockets));
    sockets.on('sendUserToOthers', (userObj) => sockets.broadcast.emit('userToBotton', userObj));
    sockets.on('disconnect', () => userDelete(sockets));
    sockets.on('requestUserChangeNick', (userObj) => userUpdate(io, userObj));
  });
};

module.exports = server;
