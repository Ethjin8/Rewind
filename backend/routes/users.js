const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const { authenticateToken } = require('../middleware/tokens.js');
const { getAllUsers, findUser, addUser } = require('../models/users.js');


router.get('/users', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
})

router.post('/users', async (req, res) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;

    // Take plaintext password and run it through the hashing algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the user to our database
    addUser(userName, hashedPassword);
    res.status(201).json("Created a new user!");
  } catch(err) {
    res.json({ error: err.message });
  }
})

module.exports = router;
