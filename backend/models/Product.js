const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String },
  category: { type: String, required: true },
  dressStyle: { type: String, default: 'Casual' },
  gender: { type: String, default: 'Unisex' },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  discount: { type: Number, default: null },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  isNewArrival: { type: Boolean, default: false },
  isTopSelling: { type: Boolean, default: false },
  colors: [colorSchema],
  sizes: [{ type: String }],
  images: [{ type: String }],
  description: { type: String },
  details: [{ type: String }],
  stock: { type: Number, default: 20 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
