const bcrypt = require('bcrypt')
const pool = require('../config/db')
const {setAuthCookie} = require('../utils/auth')

exports.login = async (req, res, next) => {
  const {email, password} = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'})
    }

    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return res.status(401).json({message: 'Invalid email or password'})
    }

    setAuthCookie(res, user)

    res.json({ message: 'Login successful' })
  } catch (error) {
    next(error)
  }
}

exports.logout = (_, res) => {
  res.clearCookie('token')
  res.json({message: 'Logged out'})
}

exports.register = async (req, res, next) => {
  try {
    const {email, password} = req.body

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (user) {
      return res.status(400).json({message: 'User already exists'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const resultNewUser = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    )

    const newUser = resultNewUser.rows[0]
    setAuthCookie(res, newUser)

    res.status(201).json({message: 'User created'})
  } catch (error) {
    next(error)
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10)
    const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [userId])
    const user = result.rows[0]

    if (!user) {
      return res.status(404).json({message: 'User not found'})
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}
