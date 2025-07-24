const express = require('express')
const {getUser, login, register} = require('../controllers/user-controller')
const {verifyToken} = require('../middleware/auth-middleware')

const router = express.Router()

router.get('/', verifyToken, getUser)
router.post('/login', login)
router.post('/register', register)

module.exports = router
