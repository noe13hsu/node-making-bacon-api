const pool = require('../config/db')
const { capitalizeFirstLetter } = require('../utils')

exports.getUserCategories = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10)
    const page = req.query.page ? parseInt(req.query.page, 10) : 1
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10

    if (isNaN(page) || page < 1) {
      return res.status(400).json({message: 'Invalid page number'})
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({message: 'Invalid limit number'})
    }

    const offset = (page - 1) * limit
    const categoryResult = await pool.query(
      `SELECT *
      FROM categories
      WHERE user_id = $1
      LIMIT $2
      OFFSET $3`,
      [userId, limit, offset]
    )

    const countResult = await pool.query('SELECT COUNT(*) FROM categories WHERE user_id = $1', [userId])
    const total = parseInt(countResult.rows[0].count, 10)

    res.json({data: categoryResult.rows, limit, page, total})
  } catch (error) {
    next(error)
  }
}

exports.createUserCategory = async (req, res, next) => {
  try {
    const {description, type} = req.body

    if (!description || !type) {
      return res.status(400).json({message: 'Missing required fields'})
    }

    const capitalizedDescription = capitalizeFirstLetter(description)
    const userId = parseInt(req.user.id, 10)
    const categoryResult = await pool.query(
      `SELECT id
      FROM categories
      WHERE description = $1 AND user_id = $2 AND type = $3`,
      [capitalizedDescription, userId, type]
    )

    if (categoryResult.rowCount > 0) {
      return res.status(400).json({message: 'Category already exists'})
    }

    await pool.query(
      'INSERT INTO categories (description, user_id, type) VALUES ($1, $2, $3)',
      [capitalizedDescription, userId, type]
    )

    res.status(201).json({message: 'Category created'})
  } catch (error) {
    next(error)
  }
}
