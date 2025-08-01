const express = require('express')
const {verifyToken} = require('../middleware/auth-middleware')
const {getUser, login, logout, register} = require('../controllers/user-controller')

const router = express.Router()

router.get('/', verifyToken, getUser)
router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)

module.exports = router
