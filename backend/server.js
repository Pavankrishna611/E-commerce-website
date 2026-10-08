const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const Product = require('./models/Product');
const { sampleProducts } = require('./seeders/seedData');
const User = require('./models/User');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Vinayaka Chikkis API',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'fallback-active',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Express Server immediately so API is 100% available instantly
app.listen(PORT, () => {
  console.log(`🚀 Vinayaka Chikkis Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
});

// Connect to MongoDB asynchronously in the background
connectDB().then(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        console.log('📦 Database empty, auto-seeding Vinayaka Chikkis catalog...');
        await Product.insertMany(sampleProducts);
        console.log('✅ Initial catalog seeded successfully.');
      }
    } catch (e) {
      console.warn('Auto-seed check note:', e.message);
    }
  }
}).catch(err => {
  console.warn('Async DB connect notice:', err.message);
});
