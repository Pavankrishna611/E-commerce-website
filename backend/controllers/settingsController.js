// In-memory store settings state with defaults
let storeSettings = {
  // Brand Header & Top Logo Settings
  brandLogoType: 'emoji', // 'emoji' | 'image'
  brandLogoImage: '',
  brandLogoEmoji: '🥜',
  brandLogoInitials: 'VC',
  brandName: 'Vinayaka Chikkis',
  brandSubtitle: 'Traditional Jaggery Delights',
  brandTagline: 'Homemade',

  // Hero Section
  heroImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
  heroBadge: 'Signature Specialty',
  heroTitle: 'Homemade Peanut & Jaggery Chikki',
  heroSubtitle: 'AAA Saurashtra Peanuts + Pure Clarified Jaggery',
  heroFloating1Emoji: '🍯',
  heroFloating1Title: '100% Desi Jaggery',
  heroFloating1Sub: 'Zero White Sugar',
  heroFloating2Emoji: '✨',
  heroFloating2Title: 'Authentic Crunch',
  heroFloating2Sub: 'Fresh Batch',
  topPillText: '🔥 Fresh Wood-Fire Batch • Traditional Godavari Recipe',
  mainHeadline: 'Traditional Homemade Chikkis',
  mainSubheadline: 'Crafted with 100% Pure Desi Jaggery',
  mainDescription: 'Slow-roasted Saurashtra groundnuts and golden sesame seeds folded into aromatic, clarified sugarcane jaggery. Experience the authentic crunch — 100% natural, high in protein & iron, and made with zero white sugar or preservatives.',
};

// @desc    Get store & hero settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  res.json(storeSettings);
};

// @desc    Update store & hero settings
// @route   PUT /api/settings
// @access  Public / Admin
const updateSettings = async (req, res) => {
  storeSettings = { ...storeSettings, ...req.body };
  res.json(storeSettings);
};

module.exports = {
  getSettings,
  updateSettings,
};
