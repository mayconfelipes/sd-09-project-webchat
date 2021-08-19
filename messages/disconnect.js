module.exports = async (io, users) => {
  io.on('disconnect', async (reason) => {
    console.log('usuários', users);
    console.log('razão', reason);
  });
};
