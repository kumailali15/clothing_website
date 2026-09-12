const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/jsonStore');

// GET /api/reviews - get reviews, optionally filtered by productId
router.get('/', (req, res) => {
  const { productId } = req.query;
  const reviews = readData('reviews.json');

  if (productId) {
    const filtered = reviews.filter(r => r.productId === productId);
    return res.json(filtered);
  }

  // If no productId, return general testimonials or all
  res.json(reviews);
});

// POST /api/reviews - add a new review
router.post('/', (req, res) => {
  const { productId, author, rating, content } = req.body;

  if (!author || !rating || !content) {
    return res.status(400).json({ error: 'Author, rating, and content are required' });
  }

  const reviews = readData('reviews.json');
  const newReview = {
    id: 'rev-' + Date.now(),
    productId: productId || null,
    author: author.trim(),
    verified: true,
    rating: Number(rating),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    content: content.trim()
  };

  reviews.unshift(newReview);
  writeData('reviews.json', reviews);

  // If productId provided, update product's reviewCount and rating
  if (productId) {
    const products = readData('products.json');
    const product = products.find(p => p.id === productId);
    if (product) {
      const prodReviews = reviews.filter(r => r.productId === productId);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      product.rating = parseFloat(avg.toFixed(1));
      product.reviewCount = prodReviews.length;
      writeData('products.json', products);
    }
  }

  res.status(201).json(newReview);
});

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  let reviews = readData('reviews.json');
  const initialLength = reviews.length;

  reviews = reviews.filter(r => r.id !== id);

  if (reviews.length === initialLength) {
    return res.status(404).json({ error: 'Review not found' });
  }

  writeData('reviews.json', reviews);
  res.json({ message: 'Review deleted successfully', id });
});

module.exports = router;
