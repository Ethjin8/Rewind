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

// Function to get all users from the database
function getAllUsers() {
  return users;
}

// Function to find user within the database
function findUser(target) {
  const user = users.find(user => user.username === target);
  if (!user) {
    return null;
  }

  return user;
}

// Function to add user in the database
function addUser(input) {
  users.push(input);
}

module.exports = { getAllUsers, findUser, addUser };