const express = require('express')
const {verifyToken} = require('../middleware/auth-middleware')

const {
  createUserCategory,
  deleteUserCategory,
  getUserCategories,
  updateUserCategory,
} = require('../controllers/category-controller')

const router = express.Router()

router.get('/', verifyToken, getUserCategories)
router.post('/', verifyToken, createUserCategory)
router.put('/:id', verifyToken, updateUserCategory)
router.delete('/:id', verifyToken, deleteUserCategory)

module.exports = router
