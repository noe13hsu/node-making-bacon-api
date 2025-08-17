const pool = require('../config/db')

exports.getUserTransactions = async (req, res, next) => {
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
    const transactionResult = await pool.query(
      `SELECT t.*, c.description AS category_description, c.type AS category_type
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE c.user_id = $1
      LIMIT $2
      OFFSET $3`,
      [userId, limit, offset]
    )

    const countResult = await pool.query(
      `SELECT COUNT(*)
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE c.user_id = $1`,
      [userId]
    )

    const total = parseInt(countResult.rows[0].count, 10)

    res.json({data: transactionResult.rows, limit, page, total})
  } catch (error) {
    next(error)
  }
}

exports.getUserRecentTransactions = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10)
    console.log('req.query.limit', req.query.limit)
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({message: 'Invalid limit number'})
    }

    const query = `
      (
        SELECT t.id, t.description, t.amount, t.date, c.description AS category, c.type
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE c.user_id = $1
          AND c.type = 'income'
          AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
        ORDER BY t.date DESC
        LIMIT $2
      )
      UNION ALL
      (
        SELECT t.id, t.description, t.amount, t.date, c.description AS category, c.type
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE c.user_id = $1
          AND c.type = 'expense'
          AND DATE_TRUNC('month', t.date) = DATE_TRUNC('month', CURRENT_DATE)
        ORDER BY t.date DESC
        LIMIT $2
      )
    `

    const { rows } = await pool.query(query, [userId, limit])
    const income = rows.filter(r => r.type === "income")
    const expense = rows.filter(r => r.type === "expense")

    res.json({income, expense})
  } catch (error) {
    next(error)
  }
}

exports.createUserTransaction = async (req, res, next) => {
  try {
    const {amount, category_id, date, description} = req.body

    if (!amount || !category_id || !date || !description) {
      return res.status(400).json({message: 'Missing required fields'})
    }

    const userId = parseInt(req.user.id, 10)
    const result = await pool.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [category_id, userId])

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

exports.updateUserTransaction = async (req, res, next) => {
  try {
    const {amount, category_id, date, description} = req.body

    if (!amount || !category_id || !date || !description) {
      return res.status(400).json({message: 'Missing required fields'})
    }

    const transactionId = parseInt(req.params.id, 10)

    if (isNaN(transactionId)) {
      return res.status(400).json({message: 'Invalid transaction id'})
    }

    const userId = parseInt(req.user.id, 10)
    // Check that transaction exists and belongs to a category owned by the user
    const transactionResult = await pool.query(
      `SELECT t.id
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE t.id = $1 AND c.user_id = $2`,
      [transactionId, userId]
    )

    if (transactionResult.rowCount === 0) {
      return res.status(404).json({message: 'Transaction not found or access denied'})
    }

    // Check that the new category (if changed) also belongs to the user
    const categoryResult = await pool.query(
      `SELECT id
      FROM categories
      WHERE id = $1 AND user_id = $2`,
      [category_id, userId]
    )

    if (categoryResult.rowCount === 0) {
      return res.status(404).json({message: 'Category not found or access denied'})
    }

    await pool.query(
      `UPDATE transactions
      SET amount = $1, category_id = $2, date = $3, description = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5`,
      [amount, category_id, date, description, transactionId]
    )

    res.json({message: 'Transaction updated'})
  } catch (error) {
    next(error)
  }
}

exports.deleteUserTransaction = async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id, 10)

    if (isNaN(transactionId)) {
      return res.status(400).json({message: 'Invalid transaction id'})
    }

    const userId = parseInt(req.user.id)
    const transactionResult = await pool.query(
      `SELECT t.id
      FROM transactions t
      JOIN categories c
      ON t.category_id = c.id
      WHERE t.id = $1 AND c.user_id = $2`,
      [transactionId, userId]
    )

    if (transactionResult.rowCount === 0) {
      return res.status(404).json({message: 'Transaction not found or access denied'})
    }

    await pool.query('DELETE FROM transactions WHERE id = $1', [transactionId])

    res.json({message: 'Transaction deleted'})
  } catch (error) {
    next(error)
  }
}
