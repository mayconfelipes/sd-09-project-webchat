const setUser = (user, id, usersOnline) => {
  usersOnline.push({ user, id });
  return usersOnline;
};

const changeUser = (newNick, id, usersOnline) => {
  let newUsers = [];
  const users = usersOnline.map((nick) => {
    if (id === nick.id) {
      return { user: newNick, id };
    }
    return nick;
  });
  newUsers = users;
  return newUsers;
};

const deleteUser = (id, usersOnline) => {
  let newUsers = [];
  const users = usersOnline.filter((nick) => {
    if (id === nick.id) {
      return false;
    }
    return nick;
  });
  newUsers = users;
  return newUsers;
};

module.exports = {
  setUser,
  changeUser,
  deleteUser,
};
