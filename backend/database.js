require('dotenv').config();

const mysql = require('mysql2/promise');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

// Returns a URL object that we can use
const parsedUrl = new URL(databaseUrl);

// A bunch of pre-opened connections to the MySQL database that the app uses
const pool = mysql.createPool({
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port || 3306),
  user: decodeURIComponent(parsedUrl.username),
  password: decodeURIComponent(parsedUrl.password),
  database: parsedUrl.pathname.replace(/^\//, ''),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
