require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json());

const { authenticateToken } = require('./middleware/tokens.js');

const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/users.js');
const tmdbRouter = require('./routes/tmdb.js');


app.use(authRouter);
app.use(userRouter);
app.use(tmdbRouter);


app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on port ${process.env.PORT || 3000}`);
});