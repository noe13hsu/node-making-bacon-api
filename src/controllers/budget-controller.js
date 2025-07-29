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
