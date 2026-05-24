const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService.js');
const pool = require('../database.js');

const { authenticateToken } = require('../middleware/tokens.js');

// Search TV shows
router.get('/api/shows/search', authenticateToken, async (req, res) => {
  try {

    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: 'query required' });
    const results = await tmdbService.searchShows(query, page || 1);
    res.json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular shows
router.get('/api/shows/popular', authenticateToken, async (req, res) => {
  try {

    const { page } = req.query;
    const results = await tmdbService.getPopularShows(page || 1);
    res.json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending shows
router.get('/api/shows/trending', authenticateToken, async (req, res) => {
  try {

    const { timeWindow } = req.query;
    const results = await tmdbService.getTrendingShows(timeWindow || 'week');
    res.json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Discover shows by genre
router.get('/api/shows/discover', authenticateToken, async (req, res) => {
  try {

    const { genre_id, page } = req.query;
    if (!genre_id) return res.status(400).json({ error: 'genre_id required' });
    const results = await tmdbService.discoverShowsByGenre(genre_id, page || 1);
    res.json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get show details
router.get('/api/shows/:id', authenticateToken, async (req, res) => {
  try {

    const { id } = req.params;
    const details = await tmdbService.getShowDetails(id);
    res.json(details);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --------- Backlog ----------- //


// Add show to backlog
router.post('/api/shows/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      INSERT INTO movies_shows (user_id, movie_show_id, type)
      VALUES(?, ?, 'show')
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Delete show from backlog
router.delete('/api/shows/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      DELETE FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = 'show'
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get watch status of a show
router.get('/api/shows/:id/status', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      SELECT status FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = 'show'
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's backlog sorted by date_added (default is desc, but you can switch to asc)
router.get('/api/backlog/sorted', authenticateToken, async (req, res) => {
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
router.get('/api/configuration', authenticateToken, async (req, res) => {
  try {

    const config = await tmdbService.getConfiguration();
    res.json(config);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
