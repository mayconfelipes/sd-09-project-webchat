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

const generateRandomName = () => randomstring.generate(16);

const server = (io) => {
  io.on('connection', (sockets) => {    
    // when user is connected "send him" to the others.
    sockets.on('userConnected', async () => {
      const randonName = generateRandomName();
      const newUser = constructUser(sockets.id, randonName);
      const { id, name } = await addUserToDataBase(newUser);
      const arrayOfUsers = await findAllUsers();
      sockets.emit('generateUser', { id, name, arrayOfUsers });
    });

    sockets.on('sendUserToOthers', (userObj) => {
      sockets.broadcast.emit('userToBotton', userObj);
    });

    sockets.on('disconnect', async () => {
      await deleteOneUser(sockets.id);
      sockets.broadcast.emit('userDisconnected', sockets.id);
    });

    // sockets.on('requestUserChangeNick', ({id, name}) => {
    //   // vai la no mongo e da um UPDATE pelo id, lembrar do ObjectID (importar a lib)...
    //   io.emit('resolveUserChangeNick', {id, name});
    // });
  });
};

module.exports = server;
