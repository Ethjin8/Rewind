const express = require('express');
const router = express.Router();
const tmdbService = require('../services/tmdbService.js');

const { authenticateToken } = require('../middleware/tokens.js');
const { addToBacklog, removeFromBacklog, getWatchStatus } = require('../models/backlog.js');

// Search TV shows
router.get('/shows/search', authenticateToken, async (req, res) => {
  try {

    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: 'query required' });
    const results = await tmdbService.searchShows(query, page || 1);
    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get popular shows
router.get('/shows/popular', authenticateToken, async (req, res) => {
  try {

    const { page } = req.query;
    const results = await tmdbService.getPopularShows(page || 1);
    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trending shows
router.get('/shows/trending', authenticateToken, async (req, res) => {
  try {

    const { timeWindow } = req.query;
    const results = await tmdbService.getTrendingShows(timeWindow || 'week');
    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Discover shows by genre
router.get('/shows/discover', authenticateToken, async (req, res) => {
  try {

    const { genre_id, page } = req.query;
    if (!genre_id) return res.status(400).json({ error: 'genre_id required' });
    const results = await tmdbService.discoverShowsByGenre(genre_id, page || 1);
    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get show details
router.get('/shows/:id', authenticateToken, async (req, res) => {
  try {

    const { id } = req.params;
    const details = await tmdbService.getShowDetails(id);
    res.json(details);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------- Backlog ----------- //


// Add show to backlog
router.post('/shows/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movieShowID = req.params.id;

    const result = await addToBacklog(uid, movieShowID, 'show');

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Delete show from backlog
router.delete('/shows/:id', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movieShowID = req.params.id;

    const result = await removeFromBacklog(uid, movieShowID, 'show');

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get watch status of a show
router.get('/shows/:id/status', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const movieShowID = req.params.id;

    const result = await getWatchStatus(uid, movieShowID, 'show');

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
