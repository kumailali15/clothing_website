const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/jsonStore');

// GET /api/orders
router.get('/', (req, res) => {
  const orders = readData('orders.json');
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const orders = readData('orders.json');
  const order = orders.find(o => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// POST /api/orders - Place a new order
router.post('/', (req, res) => {
  const { customer, items, subtotal, discount, deliveryFee, total, paymentMethod } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ error: 'Customer details and at least one item are required' });
  }

  const orders = readData('orders.json');
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal: Number(subtotal) || 0,
    discount: Number(discount) || 0,
    deliveryFee: Number(deliveryFee) || 0,
    total: Number(total) || 0,
    paymentMethod: paymentMethod || 'Credit Card',
    status: 'Confirmed'
  };

  orders.unshift(newOrder);
  writeData('orders.json', orders);

  res.status(201).json({
    message: 'Order placed successfully',
    order: newOrder
  });
});

module.exports = router;
