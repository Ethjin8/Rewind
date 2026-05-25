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

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get image URLs
router.get('/configuration', authenticateToken, async (req, res) => {
  try {

    const config = await tmdbService.getConfiguration();
    res.json(config);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;