require('dotenv').config()

const express = require('express');
const router = express.Router();

// Library that handles "salt hashing" for us
const bcrypt = require('bcrypt');

// Use JWT for user authentication/authorization
const jwt = require('jsonwebtoken')

// Need function to help us get users
const { findUser } = require('../models/users.js');


router.post('/login', async (req, res) => {
  // Authenticate user
  const user = findUser(req.body.username);
  if (user == null) return res.status(400).send("Cannot find user");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
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