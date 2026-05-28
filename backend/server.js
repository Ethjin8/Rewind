require('dotenv').config()

const express = require('express');
// CORS for middleware---not necessary right now because we have Vite as proxy
const cors = require('cors');
const app = express();
// use cors
app.use(cors());
app.use(express.json());

const { authenticateToken } = require('./middleware/tokens.js');

const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies.js');
const showsRouter = require('./routes/shows.js');
const streamingRouter = require('./routes/streaming.js');
const backlogRouter = require('./routes/backlog.js');


app.use(authRouter);
app.use(userRouter);
app.use(moviesRouter);
app.use(showsRouter);
app.use(streamingRouter);
app.use(backlogRouter);


app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on port ${process.env.PORT || 3000}`);
});