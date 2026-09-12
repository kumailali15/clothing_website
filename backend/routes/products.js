const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/jsonStore');
const { isDBConnected } = require('../config/db');
let Product;
try {
  Product = require('../models/Product');
} catch (e) {
  Product = null;
}

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    if (isDBConnected() && Product) {
      const newArrivals = await Product.find({ isNewArrival: true }).limit(4);
      const topSelling = await Product.find({ isTopSelling: true }).limit(4);
      return res.json({ newArrivals, topSelling });
    }
  } catch (err) {
    console.warn('MongoDB query failed, falling back to JSON:', err.message);
  }

  const products = readData('products.json');
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const topSelling = products.filter(p => p.isTopSelling).slice(0, 4);
  res.json({ newArrivals, topSelling });
});

// GET /api/products - list, filter, search, sort, pagination
router.get('/', async (req, res) => {
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

  // If MongoDB connected, execute query
  if (isDBConnected() && Product) {
    try {
      const filter = {};
      if (category && category !== 'all') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }
      if (dressStyle && dressStyle !== 'all') {
        filter.dressStyle = new RegExp(`^${dressStyle}$`, 'i');
      }
      if (search) {
        const regex = new RegExp(search.trim(), 'i');
        filter.$or = [{ title: regex }, { description: regex }, { category: regex }, { dressStyle: regex }];
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }
      if (color) {
        filter['colors.name'] = new RegExp(color, 'i');
      }
      if (size) {
        filter.sizes = new RegExp(size, 'i');
      }

      let sortOptions = { reviewCount: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      else if (sort === 'price-high') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1 };
      else if (sort === 'newest') sortOptions = { isNewArrival: -1, createdAt: -1 };

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 9;
      const skip = (pageNum - 1) * limitNum;

      const [products, total, allCategories, allStyles] = await Promise.all([
        Product.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
        Product.countDocuments(filter),
        Product.distinct('category'),
        Product.distinct('dressStyle')
      ]);

      return res.json({
        products,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        categories: allCategories,
        dressStyles: allStyles
      });
    } catch (err) {
      console.warn('MongoDB search query failed, using JSON fallback:', err.message);
    }
  }

  // JSON store fallback
  let products = readData('products.json');

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
    products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  }

  const total = products.length;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 9;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);

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

// GET /api/products/:id - Read Single Product
router.get('/:id', async (req, res) => {
  if (isDBConnected() && Product) {
    try {
      const product = await Product.findOne({ $or: [{ id: req.params.id }, { slug: req.params.id }] });
      if (product) {
        const related = await Product.find({
          id: { $ne: product.id },
          $or: [{ category: product.category }, { dressStyle: product.dressStyle }]
        }).limit(4);
        return res.json({ product, related });
      }
    } catch (err) {
      console.warn('MongoDB single get failed:', err.message);
    }
  }

  const products = readData('products.json');
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.dressStyle === product.dressStyle))
    .slice(0, 4);

  res.json({ product, related });
});

// POST /api/products - Create Product
router.post('/', async (req, res) => {
  const { title, price, category, dressStyle, description, images, colors, sizes, discount, originalPrice, stock } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Title, price, and category are required' });
  }

  const newId = 'prod-' + Date.now();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProductData = {
    id: newId,
    title: title.trim(),
    slug: slug,
    category: category.toLowerCase().trim(),
    dressStyle: dressStyle || 'Casual',
    gender: req.body.gender || 'Unisex',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    discount: discount ? Number(discount) : null,
    rating: 5.0,
    reviewCount: 0,
    isNewArrival: true,
    isTopSelling: false,
    colors: colors && colors.length > 0 ? colors : [{ name: 'Black', hex: '#000000' }],
    sizes: sizes && sizes.length > 0 ? sizes : ['Small', 'Medium', 'Large', 'X-Large'],
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'],
    description: description || 'Premium quality crafted garment from SHOP.CO.',
    details: req.body.details || ['100% Premium Cotton', 'Pre-shrunk fabric', 'Machine wash cold'],
    stock: stock ? Number(stock) : 25,
    createdAt: new Date().toISOString()
  };

  if (isDBConnected() && Product) {
    try {
      const created = await Product.create(newProductData);
      return res.status(201).json(created);
    } catch (err) {
      console.warn('MongoDB product creation failed, saving to JSON:', err.message);
    }
  }

  const products = readData('products.json');
  products.unshift(newProductData);
  writeData('products.json', products);
  res.status(201).json(newProductData);
});

// PUT /api/products/:id - Update Product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates.id; // Prevent modifying unique id

  if (isDBConnected() && Product) {
    try {
      const updated = await Product.findOneAndUpdate({ id }, updates, { new: true });
      if (updated) {
        return res.json(updated);
      }
    } catch (err) {
      console.warn('MongoDB product update failed, using JSON:', err.message);
    }
  }

  const products = readData('products.json');
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found to update' });
  }

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  writeData('products.json', products);
  res.json(products[index]);
});

// DELETE /api/products/:id - Delete Product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isDBConnected() && Product) {
    try {
      const deleted = await Product.findOneAndDelete({ id });
      if (deleted) {
        return res.json({ message: 'Product deleted successfully', id });
      }
    } catch (err) {
      console.warn('MongoDB product delete failed, using JSON:', err.message);
    }
  }

  let products = readData('products.json');
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found to delete' });
  }

  writeData('products.json', products);
  res.json({ message: 'Product deleted successfully', id });
});

module.exports = router;
