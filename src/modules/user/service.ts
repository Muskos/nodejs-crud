import getUsers from "./mock";
import User from "./model";

let users = getUsers();

process.on("message", function (newUsers: User[]) {
  users = newUsers;
});

const getUsersService = () => {
  return users;
};

const getUserService = (userId) => {
  return users.find(({ id }) => id === userId);
};

const addUserService = (user) => {
  users.push(user);
  if (process.send) {
    process.send(users);
  }
  return users;
};

const deleteUserService = (userId) => {
  users = users.filter(({ id }) => id !== userId);
  if (process.send) {
    process.send(users);
  }
};

const updateUserService = (userId, user) => {
  const userIndex = users.findIndex(({ id }) => userId === id);
  users[userIndex] = user;
  if (process.send) {
    process.send(users);
  }
};

export {
  getUsersService,
  getUserService,
  addUserService,
  deleteUserService,
  updateUserService,
};
