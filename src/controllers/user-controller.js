const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

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

    const payload = {email: user.email, id: user.id}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'})

    res.json({token})
  } catch (error) {
    next(error)
  }
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
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hashedPassword])

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
