const express = require('express')
const {verifyToken} = require('./middleware/auth-middleware')
const {register, login, getUser} = require('./controllers/user-controller')

const router = express.Router()

router.get('/me', verifyToken, getUser)
router.post('/register', register)
router.post('/login', login)
