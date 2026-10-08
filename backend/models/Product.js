const mongoose = require('mongoose');

const weightVariantSchema = new mongoose.Schema({
  weight: {
    type: String,
    required: true, // e.g. "250g", "500g", "1kg", "2kg Family Pack"
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  savingsText: {
    type: String,
    default: '',
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  story: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Traditional Chikkis', 'Premium Dry Fruit', 'Seed & Healthy', 'Festive Hampers'],
    default: 'Traditional Chikkis',
  },
  image: {
    type: String,
    required: true,
  },
  gallery: [{
    type: String,
  }],
  weightVariants: [weightVariantSchema],
  highlights: [{
    type: String, // e.g., "100% Vegetarian", "High Protein", "Rich in Iron", "Zero Added Cane Sugar"
  }],
  trustBadges: [{
    icon: String,
    label: String,
  }],
  ingredients: [{
    type: String,
  }],
  nutritionalInfo: {
    servingSize: { type: String, default: '100g' },
    energy: { type: String, default: '520 kcal' },
    protein: { type: String, default: '14.5g' },
    carbohydrates: { type: String, default: '52.0g' },
    dietaryFiber: { type: String, default: '6.2g' },
    iron: { type: String, default: '4.8mg (32% RDA)' },
    calcium: { type: String, default: '110mg' },
    addedSugar: { type: String, default: '0g (Only Pure Jaggery)' },
  },
  shelfLife: {
    type: String,
    default: '90 Days from packaging',
  },
  storageAdvice: {
    type: String,
    default: 'Store in an airtight container in a cool, dry place away from direct sunlight.',
  },
  rating: {
    type: Number,
    default: 4.9,
  },
  reviewCount: {
    type: Number,
    default: 128,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestseller: {
    type: Boolean,
    default: false,
  },
  badgeTag: {
    type: String,
    default: 'Artisanal Batch',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
