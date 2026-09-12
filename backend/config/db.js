const mongoose = require('mongoose');
const { readData } = require('../utils/jsonStore');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️  No MONGO_URI provided in environment. Operating with Express JSON file storage.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);

    // Auto-seed if database is empty
    try {
      const Product = require('../models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('🌱 Seeding initial products from JSON into MongoDB...');
        const initialProducts = readData('products.json');
        if (initialProducts.length > 0) {
          await Product.insertMany(initialProducts);
          console.log(`🌱 Successfully seeded ${initialProducts.length} products to MongoDB!`);
        }
      }
    } catch (seedErr) {
      console.warn('Auto-seed check failed:', seedErr.message);
    }

    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️  MongoDB connection unsuccessful (${err.message}). Continuing seamlessly with JSON storage.`);
    return false;
  }
};

const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
