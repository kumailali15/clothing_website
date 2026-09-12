const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRoute = require('./routes/products');
const reviewsRoute = require('./routes/reviews');
const authRoute = require('./routes/auth');
const ordersRoute = require('./routes/orders');
const couponsRoute = require('./routes/coupons');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Newsletter subscription endpoint
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }
  console.log(`Newsletter subscription received: ${email}`);
  res.json({ message: 'Subscribed successfully! Check your inbox for your 20% discount coupon.' });
});

// Mount routes
app.use('/api/products', productsRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/auth', authRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/coupons', couponsRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`SHOP.CO Backend server is running on http://localhost:${PORT}`);
});
