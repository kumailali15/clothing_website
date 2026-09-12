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

// PUT /api/orders/:id - Update order status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const orders = readData('orders.json');
  const index = orders.findIndex(o => o.id.toLowerCase() === id.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  writeData('orders.json', orders);

  res.json({ message: 'Order status updated', order: orders[index] });
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let orders = readData('orders.json');
  const initialLength = orders.length;

  orders = orders.filter(o => o.id.toLowerCase() !== id.toLowerCase());

  if (orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }

  writeData('orders.json', orders);
  res.json({ message: 'Order deleted successfully', id });
});

module.exports = router;
