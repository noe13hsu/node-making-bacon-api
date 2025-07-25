const express = require('express')
const {createUserTransaction, getUserTransactions} = require('../controllers/transaction-controller')
const {verifyToken} = require('../middleware/auth-middleware')

const router = express.Router()

router.get('/', verifyToken, getUserTransactions)
router.post('/', verifyToken, createUserTransaction)

module.exports = router
