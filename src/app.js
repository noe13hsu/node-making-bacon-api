const express = require('express')
const userRoutes = require('./routes/user-routes')
const transactionRoutes = require('./routes/transaction-routes')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use('/user', userRoutes)
app.use('/transactions', transactionRoutes)


module.exports = app
