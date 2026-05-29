const express = require('express');
const pool = require('../database.js');
const router = express.Router();

const { authenticateToken } = require('../middleware/tokens.js');

// Endpoint to get user's streaming services
router.get('/streaming', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const [result] = await pool.query(`
      SELECT * FROM streaming_services WHERE user_id = ?
    `, [uid]);
    res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
})

router.delete('/streaming', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const streamingService = req.body.streaming;

    const [result] = await pool.query(`
      DELETE FROM streaming_services WHERE user_id = ? AND streaming_service = ?
    `, [uid, streamingService]);

    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
})

// Endpoint to add streaming services to user profile
router.post('/streaming', authenticateToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const streamingService = req.body.streaming;

    const [result] = await pool.query(`
      INSERT INTO streaming_services (user_id, streaming_service)
      VALUES(?, ?)
    `, [uid, streamingService]);

    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
})

module.exports = router;