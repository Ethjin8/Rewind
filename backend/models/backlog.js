const pool = require('../database.js');
const tmdbService = require('../services/tmdbService.js');

async function addToBacklog(userID, movieShowID, type) {
  const [result] = await pool.query(`
      INSERT INTO movies_shows (user_id, movie_show_id, type)
      VALUES(?, ?, ?)
    `, [userID, movieShowID, type]);
  
  return result;
}

async function removeFromBacklog(userID, movieShowID, type) {
  const [result] = await pool.query(`
      DELETE FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = ?
    `, [userID, movieShowID, type]);

  return result;
}

async function getWatchStatus(userID, movieShowID, type) {
  const [result] = await pool.query(`
      SELECT status FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = ?
    `, [userID, movieShowID, type]);
  
  return result;
}

async function getUserBacklog(userID) {
  const [rows] = await pool.query(
      `SELECT * FROM movies_shows WHERE user_id = ? ORDER BY date_added DESC`,
      [userID]
    );

  return rows;
}

async function updateWatchStatus(newStatus, userID, movieShowID) {
  const [result] = await pool.query(
      `UPDATE movies_shows SET status = ? WHERE user_id = ? AND movie_show_id = ?`,
      [newStatus, userID, movieShowID]);
  
  return result;
}

module.exports = { addToBacklog, removeFromBacklog, getWatchStatus, getUserBacklog, updateWatchStatus }