const express = require('express')
const userRoutes = require('./routes/user-routes')
const transactionRoutes = require('./routes/transaction-routes')
const categoryRoutes = require('./routes/category-routes')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use('/user', userRoutes)
app.use('/transactions', transactionRoutes)
app.use('/categories', categoryRoutes)


module.exports = app
