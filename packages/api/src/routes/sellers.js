const express = require('express')
const router = express.Router()
const { becomeSeller, getSellers, approveSeller } = require('../controllers/sellers')
const { authenticate, authorize } = require('../middleware/auth')

router.post('/become-seller', authenticate, becomeSeller)
router.get('/', authenticate, authorize('ADMIN', 'SUPERADMIN'), getSellers)
router.patch('/:id/approve', authenticate, authorize('ADMIN', 'SUPERADMIN'), approveSeller)

module.exports = router