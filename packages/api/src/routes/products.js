const express = require('express')
const router = express.Router()
const { getProducts, createProduct, getProduct } = require('../controllers/products')
const { authenticate, authorize } = require('../middleware/auth')

// Barcha mahsulotlarni ko'rish — hamma ko'ra oladi
router.get('/', getProducts)

// Bitta mahsulotni ko'rish — hamma ko'ra oladi
router.get('/:id', getProduct)

// Mahsulot qo'shish — faqat sotuvchilar
router.post('/', authenticate, authorize('SELLER', 'ADMIN'), createProduct)

module.exports = router