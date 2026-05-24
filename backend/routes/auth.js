// Allows us to access our .env file variables
require('dotenv').config()

// Boilerplate setup: this routes file enables us to validate users
const express = require('express');
const router = express.Router();

// Library that handles "salt hashing" for us
const bcrypt = require('bcrypt');

// Use JWT for user authentication/authorization
const jwt = require('jsonwebtoken')

// Function to help us validate the JWT
const { authenticateToken, generateAccessToken } = require('../middleware/tokens.js');

// Function to help us get users
const { findUser } = require('../models/users.js');

// Pool for MySQL access 
const pool = require('../database.js');


// Login endpoint
router.post('/login', async (req, res) => {
  const user = await findUser(req.body.username);
  if (user == null) return res.status(400).send("Cannot find user");

  try {
    // Check if the input password (once hashed) is equal to the stored, already-hashed password
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Generate a JSON web token (signed using our ACCESS secret key) to the user
      const accessToken = generateAccessToken(user);
      // Generate another JWT for refresh purposes (signed using our REFRESH secret key)
      const refreshToken = generateRefreshToken(user);

      // Insert the refresh token into our database
      const [result] = await pool.query(`
        INSERT INTO refresh_tokens (user_id, token)
        VALUES(?, ?)
      `, [user.id, refreshToken]);

      // Send our generated ACCESS and REFRESH tokens to the user
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }
    else {
      res.send("Not allowed")
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})

// Logout endpoint
router.post('/logout', async (req, res) => {
  const refreshToken = req.body.token;

  // Delete the refresh token from our database
  const [result] = await pool.query(`
    DELETE FROM refresh_tokens WHERE token = ?
    `, [refreshToken]);
  
  res.sendStatus(204);
})

// 
router.post('/token', async(req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) {
    return res.sendStatus(401);
  }

  const [result] = await pool.query(`
    SELECT token FROM refresh_tokens WHERE token = ?
  `, [refreshToken]);

  // If the result array was empty, we know the refresh token is not there
  // Invalidate our session
  if (result.length === 0) {
    return res.sendStatus(403);
  }

  // Verify that the refresh token is valid
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  })
})


module.exports = router;