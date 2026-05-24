const jwt = require('jsonwebtoken')
require('dotenv').config()

// Determine if we have a valid access token
/* 
Takes in three parameters:
  - req (request) --> incoming HTTP request with everything client sent
  - res (response) --> the stuff we send back to client
  - next --> middleware-specific function, passes control to next function in the chain
*/

function authenticateToken(req, res, next) {
  // Grabs authorization header from the request
  // Will be in format "Bearer (TOKEN)"
  const authHeader = req.headers['authorization'];

  // If auth header exists, we split it by the space and grab the token
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  // Verify that this is a legitimate token using the secret key
  // Callback receives in two parameters: an error, and the decoded paylouad
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Set the request's user to the user JS object in our payload
    req.user = user;
    // Go to next function in the chain
    next();
  })
}

// Generate access JSON web token
// Used to determine whether or not the user's current session is still valid, as well as the things they can access
/* 
Tokens have three parts:
  - Header
      Metadata about the token, generated automatically
  - Payload
      The data we bake into the token
      For this app, we passed in the "user" JS object and constructed a new object with user.id and user.username
  - Signature
      This is the unique identifer that guarantees WE are the ones that signed this token.
      If the signature doesn't match, we know the session is invalid
*/
  
function generateAccessToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
}

// Generate refresh JSON web token
// We cannot rely on an access token alone---if it were to become compromised, the entire website is susceptible to attack
// So, we have a refresh token: every 30 minutes, when the access token expires, our backend checks if the refresh token is valid (exists in the database)
// If the refresh token is valid, we generate a new access token and send it to the client so the session continues
function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = { authenticateToken, generateAccessToken, generateRefreshToken };