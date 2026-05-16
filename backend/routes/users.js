const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth.js');
const { getAllUsers, findUser, addUser } = require('../models/users.js');


router.get('/users', (req, res) => {
  const users = getAllUsers();
  res.json(users);
})

router.post('/users', async (req, res) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;

    // Take plaintext password and run it through the hashing algorithm
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the user to our database
    addUser({ "username": userName, "password": hashedPassword });
    res.status(201).json("Created a new user!");
  } catch(err) {
    res.json({ error: err.message });
  }
})

module.exports = router;
