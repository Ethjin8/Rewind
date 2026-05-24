const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService');
const pool = require('../database.js');

const { authenticateToken } = require('../middleware/tokens.js');

// Search movies
router.get('/api/movies/search', authenticateToken, async (req, res) => {
  try {
    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });
    
    // Default to first page
    const results = await tmdbService.searchMovies(query, page || 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular movies
router.get('/api/movies/popular', authenticateToken, async (req, res) => {
  try {
    const { page } = req.query;
    // Default to first page 
    const results = await tmdbService.getPopularMovies(page || 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending movies
router.get('/api/movies/trending', authenticateToken, async (req, res) => {
  try {
    const { timeWindow } = req.query;
    // Default to first week
    const results = await tmdbService.getTrendingMovies(timeWindow || 'week');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get movie details
router.get('/api/movies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const details = await tmdbService.getMovieDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Allow user to add movie
router.post('/api/movies/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      INSERT INTO movies_shows (user_id, movie_show_id)
      VALUES(?, ?)
    `, [uid, movie_show_id]);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Allow user to delete movie
router.delete('/api/movies/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      DELETE FROM movies_shows WHERE user_id = ? AND movie_show_id = ?
    `, [uid, movie_show_id]);

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Get watch status of a movie
router.get('/api/movies/:id/status', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      SELECT status FROM movies_shows WHERE user_id = ? AND movie_show_id = ?
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Get configuration (image URLs)
router.get('/api/configuration', authenticateToken, async (req, res) => {
  try {
    const config = await tmdbService.getConfiguration();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
