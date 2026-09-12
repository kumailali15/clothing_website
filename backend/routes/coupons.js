const express = require('express');
const router = express.Router();

const COUPONS = {
  'SHOP20': { code: 'SHOP20', type: 'percentage', value: 20, description: '20% off entire order' },
  'WELCOME10': { code: 'WELCOME10', type: 'percentage', value: 10, description: '10% off for new shoppers' },
  'FREESHIP': { code: 'FREESHIP', type: 'shipping', value: 15, description: 'Free Standard Delivery' }
};

// POST /api/coupons/validate
router.post('/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, error: 'Promo code is required' });
  }

  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS[normalized];

  if (!coupon) {
    return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
  }

  res.json({
    valid: true,
    coupon
  });
});

module.exports = router;
