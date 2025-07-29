const express = require('express')
const { verifyToken } = require('../middleware/auth-middleware')
const { getUserBudget } = require('../controllers/budget-controller')

const router = express.Router()

router.get('/', verifyToken, getUserBudget)

module.exports = router
