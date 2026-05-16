const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ejscfj@@57821$',
  database: 'media_backlog'
})

db.connect();

// Function to get all users from the database
function getAllUsers() {
  const sql = 'SELECT * FROM USERS';
  db.query(sql, (err, result) => {
    if (err) throw err.message;
    return result;
  });
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
