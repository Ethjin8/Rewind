const users = [
  {
    username: 'Ethan',
    password: 'hello'
  },
  {
    username: 'Edward',
    password: 'world'
  }
]

function getAllUsers() {
  return users;
}

function findUser(target) {
  const user = users.find(user => user.username === target);
  if (!user) {
    return null;
  }

  return user;
}

function addUser(input) {
  users.push(input);
}

module.exports = { getAllUsers, findUser, addUser };