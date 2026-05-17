const express = require('express')
const router = express.Router()
const { becomeSeller, getSellers } = require('../controllers/sellers')
const { authenticate, authorize } = require('../middleware/auth')

// Sotuvchi bo'lish
router.post('/become-seller', authenticate, becomeSeller)

// Barcha sotuvchilar (faqat admin)
router.get('/', authenticate, authorize('ADMIN', 'SUPERADMIN'), getSellers)

module.exports = router