const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService.js');
const pool = require('../database.js');

const { authenticateToken } = require('../middleware/tokens.js');

// Get user's backlog sorted by date_added (default is desc, but you can switch to asc)
router.get('/backlog/sorted', authenticateToken, async (req, res) => {
  try {

    const uid = req.user.id;
    const { order } = req.query;
    const direction = order === 'asc' ? 'ASC' : 'DESC';
    const [rows] = await pool.query(
      `SELECT * FROM movies_shows WHERE user_id = ? ORDER BY date_added ${direction}`,
      [uid]
    );
    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/backlog/status/:id', authenticateToken, async (req, res) => {
  try {
    const movie_show_id = req.params.id;
    const uid = req.user.id;
    const newStatus = req.body.status;

    const [result] = await pool.query(
      `UPDATE movies_shows SET status = ? WHERE movie_show_id = ? AND user_id = ?`,
      [newStatus, movie_show_id, uid]);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Movie not found in backlog" });
      return;
    }
    
    res.status(200).json({ message: "Status updated "});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get image URLs
router.get('/configuration', authenticateToken, async (req, res) => {
  try {

    const config = await tmdbService.getConfiguration();
    res.json(config);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;