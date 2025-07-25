const { parse } = require('dotenv')
const pool = require('../config/db')

exports.getUserTransactions = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10)
    const page = req.query.page ? parseInt(req.query.page, 10) : 1
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10

    if (isNaN(page) || page < 1) {
      return res.status(400).json({ message: 'Invalid page number' })
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ message: 'Invalid limit number' })
    }

    const offset = (page - 1) * limit
    const transactions = await pool.query(
      `SELECT
        t.*,
        c.description AS category_description,
        c.type AS category_type
      FROM
        transactions t
      JOIN
        categories c
      ON
        t.category_id = c.id
      WHERE
        c.user_id = $1 LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    )
    const count = await pool.query(
      `SELECT
        COUNT(*)
      FROM
        transactions t
      JOIN
        categories c
      ON
        t.category_id = c.id
      WHERE
        c.user_id = $1`,
      [userId]
    )
    const total = parseInt(count.rows[0].count, 10)

    res.json({data: transactions.rows, limit, page, total})
  } catch (error) {
    next(error)
  }
}

exports.createUserTransaction = async (req, res, next) => {
  try {
    const {amount, category_id, date, description} = req.body

    if (!amount || !category_id || !date || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const userId = parseInt(req.user.id, 10)
    const result = await pool.query('SELECT id from categories WHERE id = $1 AND user_id = $2', [category_id, userId])

    // Make sure the category belongs to the user
    if (result.rowCount === 0) {
      return res.status(400).json({message: 'Invalid category id'})
    }

    await pool.query(
      'INSERT INTO transactions (amount, category_id, date, description) VALUES ($1, $2, $3, $4)',
      [amount, category_id, date, description]
    )

    res.status(201).json({message: 'Transaction created'})
  } catch (error) {
    next(error)
  }
}
