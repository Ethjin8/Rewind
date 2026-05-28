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

// Return from backlog with TMDB details
router.get('/backlog/full', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const [rows] = await pool.query(
      `SELECT * FROM movies_shows WHERE user_id = ? ORDER BY date_added DESC`,
      [uid]
    );

    const detailed = await Promise.all(rows.map(async (r) => {
      try {
        const details = await tmdbService.getMovieDetails(r.movie_show_id);
        return {
          id: r.movie_show_id,
          type: r.type,
          status: r.status,
          date_added: r.date_added,
          title: details.title || null,
          poster_path: details.poster_path || null,
          overview: details.overview || null,
          release_date: details.release_date || null,
          'watch/providers': details['watch/providers'] || { results: {} },
        };
      } catch (e) {
        // If TMDB lookup fails for an item, include the DB row minimally
        return {
          id: r.movie_show_id,
          type: r.type,
          status: r.status,
          date_added: r.date_added,
          title: null,
          poster_path: null,
          overview: null,
          release_date: null,
          'watch/providers': { results: {} },
        };
      }
    }));

    res.json(detailed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Compute "Available on my streaming services" by checking TMDB providers
router.get('/backlog/available', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    // fetch user's streaming services
    const [servicesRows] = await pool.query(`SELECT streaming_service FROM streaming_services WHERE user_id = ?`, [uid]);
    const userServices = servicesRows.map((s) => (s.streaming_service || '').toLowerCase());

    if (userServices.length === 0) {
      return res.json([]);
    }

    // fetch a page of popular movies to populate candidates
    const popular = await tmdbService.getPopularMovies(1);
    const results = popular.results || [];

    const available = [];
    for (const m of results) {
      try {
        const details = await tmdbService.getMovieDetails(m.id);
        const prov = details['watch/providers']?.results?.US || {};
        // gather provider names from flatrate/buy/rent
        const providerNames = [];
        ['flatrate', 'buy', 'rent'].forEach((k) => {
          if (Array.isArray(prov[k])) {
            prov[k].forEach((p) => providerNames.push((p.provider_name || '').toLowerCase()));
          }
        });

        const match = providerNames.some((pn) => userServices.includes(pn));
        if (match) {
          available.push({
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            'watch/providers': details['watch/providers'] || { results: {} },
          });
        }
      } catch (e) {
        // ignore TMDB lookup failure for this movie
      }
      if (available.length >= 20) break;
    }

    res.json(available);
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