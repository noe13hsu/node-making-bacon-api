const jwt = require('jsonwebtoken')
const {ONE_HOUR} = require('../constants')

exports.setAuthCookie = (res, user) => {
  const payload = {email: user.email, id: user.id}
  const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: ONE_HOUR,
    sameSite: 'Lax', // Helps prevent CSRF
    secure: process.env.NODE_ENV === 'production',
  })
}
