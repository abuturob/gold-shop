const express = require('express')
const router = express.Router()
const { becomeSeller, getSellers, approveSeller, getMyProducts, getMyStats } = require('../controllers/sellers')
const { authenticate, authorize } = require('../middleware/auth')

router.post('/become-seller', authenticate, becomeSeller)
router.get('/', authenticate, authorize('ADMIN', 'SUPERADMIN'), getSellers)
router.patch('/:id/approve', authenticate, authorize('ADMIN', 'SUPERADMIN'), approveSeller)
router.get('/my/products', authenticate, authorize('SELLER'), getMyProducts)
router.get('/my/stats', authenticate, authorize('SELLER'), getMyStats)

module.exports = router