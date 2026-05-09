const jwt = require('jsonwebtoken')
require('dotenv').config()

function authenticateToken(req, res, next) {
  // Grabs authorization header from the request
  const authHeader = req.headers['authorization'];

  // If auth header exists, we split it and grab the token
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  // Verify that this is a legitimate token using the secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  })
}

module.exports = { authenticateToken };