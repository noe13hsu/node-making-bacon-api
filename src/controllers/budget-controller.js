const pool = require('../config/db')

exports.getUserBudget = async (req, res, next) => {
  try {
    const userId = parseInt(req.user.id, 10)

    const {rowCount, rows} = await pool.query('SELECT amount, updated_at FROM budget WHERE user_id = $1', [userId])

    if (rowCount === 0) {
      return res.status(404).json({message: 'Budget not found'})
    }

    res.json({data: rows[0]})
  } catch (error) {
    next(error)
  }
}

exports.updateUserBudget = async (req, res, next) => {
  try {
    const {amount} = req.body

    // Allow amount to be 0
    if (amount === undefined) {
      return res.status(400).json({message: "Missing required fields"})
    }

    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({message: 'Invalid budget number'})
    }

    const userId = parseInt(req.user.id, 10)
    const budgetResult = await pool.query(
      'UPDATE budget SET amount = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [amount, userId]
    )

    if (budgetResult.rowCount === 0) {
      return res.status(404).json({message: 'Budget not found'})
    }

    res.json({message: 'Budget updated'})
  } catch (error) {
    next(error)
  }
}
