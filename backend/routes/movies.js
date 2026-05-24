const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService.js');
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

// Discover movies by genre via TMDB (for the Discover page)
router.get('/api/movies/discover', authenticateToken, async (req, res) => {
  try {

    const { genre_id, page } = req.query;
    if (!genre_id) return res.status(400).json({ error: 'genre_id required' });
    const results = await tmdbService.discoverMoviesByGenre(genre_id, page || 1);
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

// --------- Backlog ----------- //

// Add movie to backlog
router.post('/api/movies/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      INSERT INTO movies_shows (user_id, movie_show_id, type)
      VALUES(?, ?, 'movie')
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Delete movie from backlog
router.delete('/api/movies/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      DELETE FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = 'movie'
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
      SELECT status FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = 'movie'
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

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
