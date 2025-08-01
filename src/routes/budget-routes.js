const express = require('express')
const {verifyToken} = require('../middleware/auth-middleware')
const {getUserBudget, updateUserBudget} = require('../controllers/budget-controller')

const router = express.Router()

router.get('/', verifyToken, getUserBudget)
router.put('/', verifyToken, updateUserBudget)

module.exports = router
