const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRoutes = require('./routes/user-routes')
const transactionRoutes = require('./routes/transaction-routes')
const categoryRoutes = require('./routes/category-routes')
const budgetRoutes = require('./routes/budget-routes')

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

app.use('/user', userRoutes)
app.use('/transactions', transactionRoutes)
app.use('/categories', categoryRoutes)
app.use('/budget', budgetRoutes)


module.exports = app
