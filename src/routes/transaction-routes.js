const express = require('express')
const {verifyToken} = require('../middleware/auth-middleware')

const {
  createUserTransaction,
  deleteUserTransaction,
  getUserTransactions,
  updateUserTransaction,
} = require('../controllers/transaction-controller')

const router = express.Router()

router.get('/', verifyToken, getUserTransactions)
router.post('/', verifyToken, createUserTransaction)
router.put('/:id', verifyToken, updateUserTransaction)
router.delete('/:id', verifyToken, deleteUserTransaction)

module.exports = router
