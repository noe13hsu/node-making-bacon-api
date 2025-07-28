const express = require('express')
const { verifyToken } = require('../middleware/auth-middleware')

const {
    createUserCategory,
    getUserCategories
} = require('../controllers/category-controller')

const router = express.Router()

router.get('/', verifyToken, getUserCategories)
router.post('/', verifyToken, createUserCategory)

module.exports = router
