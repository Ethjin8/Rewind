const express = require('express');
const router = express.Router();
const rawgService = require('../services/rawgService');
const { authenticateToken } = require('../middleware/tokens.js');

// Search games by title
router.get('/api/games/search', authenticateToken, async (req, res) => {
  try {
    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: 'query required' });
    const results = await rawgService.searchGames(query, page || 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular games
router.get('/api/games/popular', authenticateToken, async (req, res) => {
  try {
    const { page } = req.query;
    const results = await rawgService.getPopularGames(page || 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Discover games by genre (use genre slug e.g. "action", "rpg", "shooter")
router.get('/api/games/discover', authenticateToken, async (req, res) => {
  try {
    const { genre, page } = req.query;
    if (!genre) return res.status(400).json({ error: 'genre required' });
    const results = await rawgService.discoverGamesByGenre(genre, page || 1);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all game genres (so frontend can build a genre picker)
router.get('/api/games/genres', authenticateToken, async (req, res) => {
  try {
    const results = await rawgService.getGenres();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game details by RAWG id
router.get('/api/games/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const details = await rawgService.getGameDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
