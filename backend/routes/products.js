const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/jsonStore');

// GET /api/products/featured
router.get('/featured', (req, res) => {
  const products = readData('products.json');
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const topSelling = products.filter(p => p.isTopSelling).slice(0, 4);
  res.json({ newArrivals, topSelling });
});

// GET /api/products - list, filter, search, sort, pagination
router.get('/', (req, res) => {
  let products = readData('products.json');

  const {
    category,
    dressStyle,
    search,
    minPrice,
    maxPrice,
    color,
    size,
    sort,
    page = 1,
    limit = 9
  } = req.query;

  // Filter by category
  if (category && category !== 'all') {
    products = products.filter(
      p => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by dress style
  if (dressStyle && dressStyle !== 'all') {
    products = products.filter(
      p => p.dressStyle && p.dressStyle.toLowerCase() === dressStyle.toLowerCase()
    );
  }

  // Filter by search query
  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.dressStyle && p.dressStyle.toLowerCase().includes(q))
    );
  }

  // Filter by price range
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Filter by color
  if (color) {
    products = products.filter(p =>
      p.colors && p.colors.some(c => c.name.toLowerCase().includes(color.toLowerCase()))
    );
  }

  // Filter by size
  if (size) {
    products = products.filter(p =>
      p.sizes && p.sizes.some(s => s.toLowerCase() === size.toLowerCase())
    );
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else {
    // Default 'popular'
    products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }

  const total = products.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);

  // Collect unique categories & styles for filters
  const allProducts = readData('products.json');
  const categories = [...new Set(allProducts.map(p => p.category))];
  const dressStyles = [...new Set(allProducts.map(p => p.dressStyle))];

  res.json({
    products: paginated,
    total,
    page: pageNum,
    totalPages,
    categories,
    dressStyles
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const products = readData('products.json');
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Find related products (same category or style)
  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.dressStyle === product.dressStyle))
    .slice(0, 4);

  res.json({ product, related });
});

// POST /api/products - add new product
router.post('/', (req, res) => {
  const products = readData('products.json');
  const newProduct = {
    id: 'prod-' + Date.now(),
    createdAt: new Date().toISOString(),
    ...req.body
  };

  products.unshift(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

module.exports = router;
