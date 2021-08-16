const setUser = (user, id, usersOnline) => {
  usersOnline.push({ user, id });
  return usersOnline;
};

const changeUser = (newNick, id, usersOnline) => {
  const users = usersOnline.map((nick) => {
    if (id === nick.id) {
      return { user: newNick, id };
    }
    return nick;
  });
  return users;
};

const deleteUser = (id, usersOnline) => {
  const users = usersOnline.filter((nick) => {
    if (id === nick.id) {
      return false;
    }
    return nick;
  });
  return users;
};

module.exports = {
  setUser,
  changeUser,
  deleteUser,
};
