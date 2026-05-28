const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../database.js');
const router = express.Router();

const { getAllUsers, findUser, addUser } = require('../models/users.js');


// Endpoint to get all users
router.get('/users', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
})

// Endpoint to create new user
router.post('/users', async (req, res) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;

    // Take plaintext password and run it through the hashing algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the user to our database
    await addUser(userName, hashedPassword);
    res.status(201).json("Created a new user!");
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already taken.' });
    }
    res.status(500).json({ error: err.message });
  }
})


module.exports = router;
