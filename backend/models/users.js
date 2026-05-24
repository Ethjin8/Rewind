const pool = require('../database.js');


// Retrieve all users from the database
async function getAllUsers() {
  // Initially, this is an array containing two elements: the first is an array of JS row objects, the second is an array of field metadata objects
  // Destructuring pattern: [rows] just gets the first array, which is an array w/ all the rows of user data
  // Same pattern is used for the rest of the functions here
  const [rows] = await pool.query(`SELECT * FROM users`);

  // Returns rows of users
  return rows;
}

// Find specific user
async function findUser(username) {
  const [row] = await pool.query(`
    SELECT * 
    FROM users
    WHERE username = ?
    `, [username])

    // Returns single user object, extracted from row array (only has one element, the user)
  return row[0];
}

// Add user into database
async function addUser(username, password) {
  const [result] = await pool.query(`
    INSERT INTO users (username, password)
    VALUES(?, ?)
  `, [username, password]);

  // Returns ResultSetHeader object, showing what changed in the database
  return result;
}


module.exports = { getAllUsers, findUser, addUser }