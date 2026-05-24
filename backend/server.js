require('dotenv').config()

const express = require('express');
// cors for middleware
const cors = require('cors');
const app = express();
// use cors
app.use(cors());
app.use(express.json());

const { authenticateToken } = require('./middleware/tokens.js');

const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/users.js');
const tmdbRouter = require('./routes/tmdb.js');
const igdbRouter = require('./routes/igdb.js');


app.use(authRouter);
app.use(userRouter);
app.use(tmdbRouter);


app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on port ${process.env.PORT || 3000}`);
});