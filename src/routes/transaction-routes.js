const express = require('express')
const {getUserTransactions} = require('../controllers/transaction-controller')
const {verifyToken} = require('../middleware/auth-middleware')

const router = express.Router()

router.get('/transactions', verifyToken, getUserTransactions)

module.exports = router
