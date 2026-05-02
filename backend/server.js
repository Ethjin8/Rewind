require('dotenv').config()

const express = require('express');
const app = express();
app.use(express.json());

const { authenticateToken } = require('./middleware/auth.js');

const authRouter = require('./routes/auth.js');
const userRouter = require('./routes/users.js');


app.use(authRouter);
app.use(userRouter);


app.listen(3000);