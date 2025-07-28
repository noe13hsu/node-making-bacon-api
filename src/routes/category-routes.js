const express = require('express')
const { verifyToken } = require('../middleware/auth-middleware')
const { getUserCategories } = require('../controllers/category-controller')

const router = express.Router()

router.get('/', verifyToken, getUserCategories)

module.exports = router
