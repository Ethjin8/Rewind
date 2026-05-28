const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService.js');
const pool = require('../database.js');

const { authenticateToken } = require('../middleware/tokens.js');

// Search movies
router.get('/movies/search', async (req, res) => {
  try {

    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: 'Query required' });
    
    // Default to first page
    const results = await tmdbService.searchMovies(query, page || 1);
    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get popular movies
router.get('/movies/popular', authenticateToken, async (req, res) => {
  try {

    const { page } = req.query;
    // Default to first page 
    const results = await tmdbService.getPopularMovies(page || 1);
    res.json(results);

    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trending movies
router.get('/movies/trending', authenticateToken, async (req, res) => {
  try {

    const { timeWindow } = req.query;
    // Default to first week
    const results = await tmdbService.getTrendingMovies(timeWindow || 'week');
    res.json(results);


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Discover movies by genre via TMDB (for the Discover page)
router.get('/movies/discover', authenticateToken, async (req, res) => {
  try {

    const { genre_id, page } = req.query;
    if (!genre_id) return res.status(400).json({ error: 'genre_id required' });
    const results = await tmdbService.discoverMoviesByGenre(genre_id, page || 1);
    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get movie details
router.get('/movies/:id', async (req, res) => {
  try {

    const { id } = req.params;
    const details = await tmdbService.getMovieDetails(id);
    res.json(details);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------- Backlog ----------- //

// Add movie to backlog
router.post('/movies/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      INSERT INTO movies_shows (user_id, movie_show_id, type)
      VALUES(?, ?, 'movie')
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Delete movie from backlog
router.delete('/movies/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      DELETE FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = 'movie'
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Get watch status of a movie
router.get('/movies/:id/status', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movie_show_id = req.params.id;

    const [result] = await pool.query(`
      SELECT status FROM movies_shows WHERE user_id = ? AND movie_show_id = ? AND type = 'movie'
    `, [uid, movie_show_id]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


module.exports = router;
