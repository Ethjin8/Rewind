const pool = require('../database.js');


async function getAllUsers() {
  const [rows] = await pool.query(`SELECT * FROM users`);
  return rows;
}

async function findUser(username) {
  const [row] = await pool.query(`
    SELECT * 
    FROM users
    WHERE username = ?
    `, [username])

  return row[0];
}

async function addUser(username, password) {
  const [result] = await pool.query(`
    INSERT INTO users (username, password)
    VALUES(?, ?)
  `, [username, password])

  return result;
}

module.exports = { getAllUsers, findUser, addUser }