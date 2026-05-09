require('dotenv').config()

// Boilerplate setup: this routes file enables us to validate users
const express = require('express');
const router = express.Router();

// Library that handles "salt hashing" for us
const bcrypt = require('bcrypt');

// Use JWT for user authentication/authorization
const jwt = require('jsonwebtoken')

// Need function to help us get users
const { findUser } = require('../models/users.js');


router.post('/login', async (req, res) => {
  const user = findUser(req.body.username);
  if (user == null) return res.status(400).send("Cannot find user");

  try {
    // Check if the input password (once hashed) is equal to the stored, already-hashed password
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Provide the user a JWT token (signed using our secret key), and sent it in the result body
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    }
    else {
      res.send("Not allowed")
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})


module.exports = router;