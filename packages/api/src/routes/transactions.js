const express = require('express')
const router = express.Router()
const { createTransaction, getMyTransactions, getSellerTransactions, getAllTransactions } = require('../controllers/transactions')
const { authenticate, authorize } = require('../middleware/auth')

router.post('/', authenticate, authorize('BUYER', 'SELLER'), createTransaction)
router.get('/my', authenticate, getMyTransactions)
router.get('/seller', authenticate, authorize('SELLER'), getSellerTransactions)
router.get('/all', authenticate, authorize('ADMIN', 'SUPERADMIN'), getAllTransactions)

module.exports = router