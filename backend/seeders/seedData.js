const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const { connectDB, disconnectDB } = require('../config/db');

dotenv.config();

const sampleProducts = [
  {
    title: 'Homemade Peanut Chikki',
    slug: 'homemade-peanut-chikki',
    subtitle: 'Traditional Kadalai Mittai / Groundnut Jaggery Bar',
    description: 'Slow-roasted AAA grade native groundnuts bound with organically clarified golden sugarcane jaggery in traditional heavy brass kadhais.',
    story: 'Prepared following our grandmother’s 35-year-old traditional recipe from Godavari district. We hand-sort every batch of local Saurashtra peanuts and slow-roast them over wood fire embers before blending with liquid golden jaggery.',
    category: 'Traditional Chikkis',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568827999250-3f04a5598f80?q=80&w=800&auto=format&fit=crop',
    ],
    weightVariants: [
      { weight: '250g', price: 110, originalPrice: 135, inStock: true, savingsText: 'Save ₹25' },
      { weight: '500g', price: 210, originalPrice: 270, inStock: true, savingsText: 'Save ₹60 (Most Popular)' },
      { weight: '1kg', price: 399, originalPrice: 540, inStock: true, savingsText: 'Save ₹141 (Best Value)' },
      { weight: '2kg Family Pack', price: 760, originalPrice: 1080, inStock: true, savingsText: 'Save ₹320 (Mega Saver)' },
    ],
    highlights: [
      '100% Vegetarian',
      'High Protein (14.5g / 100g)',
      'Rich in Iron & Minerals',
      'Zero Refined Sugar',
      'Brass Kadhai Slow Roasted',
    ],
    trustBadges: [
      { icon: 'ShieldCheck', label: '100% Organic Jaggery' },
      { icon: 'Award', label: 'Artisanal Handcrafted' },
      { icon: 'Heart', label: 'Zero Preservatives' },
    ],
    ingredients: [
      'Premium AAA Roasted Groundnuts (68%)',
      'Organic Clarified Sugarcane Jaggery (30%)',
      'Pure Desi Cow Ghee (1%)',
      'Stone-Ground Green Cardamom (1%)',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '530 kcal',
      protein: '15.2g',
      carbohydrates: '49.8g',
      dietaryFiber: '5.8g',
      iron: '5.1mg (36% RDA)',
      calcium: '95mg',
      addedSugar: '0g (100% Pure Jaggery)',
    },
    shelfLife: '90 Days from packaging in ambient temperature',
    storageAdvice: 'Store in an airtight container in a cool, dry place. No refrigeration needed.',
    rating: 4.9,
    reviewCount: 342,
    isFeatured: true,
    isBestseller: true,
    badgeTag: '🔥 Bestseller (Over 10,000+ sold)',
  },
  {
    title: 'Sesame Chikki (Til Patti)',
    slug: 'sesame-chikki-til-patti',
    subtitle: 'Toasted White Sesame & Jaggery Energy Crunch',
    description: 'Crisp, feather-light brittle made with premium toasted white sesame seeds and hand-churned jaggery, rich in natural calcium and bone-strengthening minerals.',
    story: 'Sesame is revered in Indian tradition for its warming, energizing properties. We lightly toast pearl-white sesame seeds to release their aromatic essential oils before setting them into thin, crunchy golden crisps.',
    category: 'Traditional Chikkis',
    image: 'https://res.cloudinary.com/k84w0prr/image/upload/v1788266818/sesame%20laddu.png',
    gallery: [
      'https://res.cloudinary.com/k84w0prr/image/upload/v1788266818/sesame%20laddu.png',
    ],
    weightVariants: [
      { weight: '250g', price: 130, originalPrice: 160, inStock: true, savingsText: 'Save ₹30' },
      { weight: '500g', price: 250, originalPrice: 320, inStock: true, savingsText: 'Save ₹70 (Recommended)' },
      { weight: '1kg', price: 475, originalPrice: 640, inStock: true, savingsText: 'Save ₹165 (Super Saver)' },
    ],
    highlights: [
      '100% Vegetarian',
      'High Protein (12.8g / 100g)',
      'Rich in Iron & Calcium (145mg)',
      'No Refined Sugar',
      'Thin & Crispy Snap',
    ],
    trustBadges: [
      { icon: 'ShieldCheck', label: 'Rich in Bone Calcium' },
      { icon: 'Flame', label: 'Wood-Fire Toasted' },
      { icon: 'Sparkles', label: 'Cardamom Infused' },
    ],
    ingredients: [
      'Pearl White Toasted Sesame Seeds (65%)',
      'Organic Palm & Cane Jaggery (32%)',
      'Desi Ghee (2%)',
      'Elaichi Cardamom Powder (1%)',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '510 kcal',
      protein: '13.1g',
      carbohydrates: '47.5g',
      dietaryFiber: '7.2g',
      iron: '6.4mg (45% RDA)',
      calcium: '145mg (18% RDA)',
      addedSugar: '0g (Only Pure Jaggery)',
    },
    shelfLife: '90 Days from packaging',
    storageAdvice: 'Keep sealed in a moisture-free tin or glass jar.',
    rating: 4.8,
    reviewCount: 218,
    isFeatured: true,
    isBestseller: true,
    badgeTag: '⭐ Customer Favorite',
  },
  {
    title: 'Dry Fruit Royal Crunch Chikki',
    slug: 'dry-fruit-royal-crunch-chikki',
    subtitle: 'Almonds, Cashews, Pistachios with Dark Palm Jaggery',
    description: 'A luxurious royal confection loaded with whole California almonds, cashew nuts, and Afghani green pistachios set into dark artisanal palm jaggery.',
    story: 'Crafted for celebratory gifting and nutrient-dense snacking, this royal recipe combines slow-roasted whole nuts with mineral-rich Karupatti (natural palm jaggery).',
    category: 'Premium Dry Fruit',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop',
    ],
    weightVariants: [
      { weight: '250g', price: 240, originalPrice: 290, inStock: true, savingsText: 'Save ₹50' },
      { weight: '500g', price: 460, originalPrice: 580, inStock: true, savingsText: 'Save ₹120 (Popular Gift)' },
      { weight: '1kg', price: 890, originalPrice: 1160, inStock: true, savingsText: 'Save ₹270 (Royal Pack)' },
    ],
    highlights: [
      '100% Vegetarian',
      'High Protein (16.8g / 100g)',
      'Rich in Iron & Antioxidants',
      'Zero White Sugar',
      'Whole Premium Nuts (70%)',
    ],
    trustBadges: [
      { icon: 'Crown', label: 'Royal Selection' },
      { icon: 'ShieldCheck', label: 'Palm Jaggery' },
      { icon: 'Heart', label: 'Heart Healthy Fats' },
    ],
    ingredients: [
      'Roasted California Almonds (25%)',
      'Goan Cashew Nuts (25%)',
      'Afghani Pistachios (15%)',
      'Organic Palm Jaggery (32%)',
      'Pure Gir Cow Ghee (2%)',
      'Nutmeg & Saffron Strands (1%)',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '565 kcal',
      protein: '16.8g',
      carbohydrates: '42.0g',
      dietaryFiber: '6.5g',
      iron: '4.9mg (35% RDA)',
      calcium: '120mg',
      addedSugar: '0g',
    },
    shelfLife: '75 Days from packaging',
    storageAdvice: 'Store in an airtight container away from warmth.',
    rating: 5.0,
    reviewCount: 164,
    isFeatured: true,
    isBestseller: false,
    badgeTag: '👑 Premium Luxury',
  },
  {
    title: 'Coconut Jaggery Delight (Thengai Mittai)',
    slug: 'coconut-jaggery-delight',
    subtitle: 'Sun-Dried Coastal Coconut with Caramelized Jaggery',
    description: 'Freshly shredded Kerala coastal coconuts gently roasted and infused with thick, fragrant jaggery syrup for an irresistible chewy-crunch texture.',
    story: 'Reminiscent of childhood temple fairs and village sweet carts, our Thengai Mittai uses thick-cut fresh coconut flakes that preserve rich natural coconut milk oils.',
    category: 'Traditional Chikkis',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    ],
    weightVariants: [
      { weight: '250g', price: 125, originalPrice: 150, inStock: true, savingsText: 'Save ₹25' },
      { weight: '500g', price: 240, originalPrice: 300, inStock: true, savingsText: 'Save ₹60' },
      { weight: '1kg', price: 450, originalPrice: 600, inStock: true, savingsText: 'Save ₹150' },
    ],
    highlights: [
      '100% Vegetarian',
      'Rich in Healthy MCTs',
      'Rich in Iron & Fiber',
      'Zero Artificial Essences',
      'Fresh Kerala Coconuts',
    ],
    trustBadges: [
      { icon: 'Leaf', label: '100% Plant Based' },
      { icon: 'Sun', label: 'Sun-Dried Coconuts' },
      { icon: 'Check', label: 'No Trans Fats' },
    ],
    ingredients: [
      'Freshly Grated & Sun-dried Coconut (60%)',
      'Organic Sugarcane Jaggery (37%)',
      'Cardamom Powder (2%)',
      'Dry Ginger Chukku (1%)',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '495 kcal',
      protein: '7.4g',
      carbohydrates: '58.0g',
      dietaryFiber: '9.1g',
      iron: '3.8mg',
      calcium: '65mg',
      addedSugar: '0g',
    },
    shelfLife: '60 Days from packaging',
    storageAdvice: 'Store in a cool dry container.',
    rating: 4.7,
    reviewCount: 96,
    isFeatured: false,
    isBestseller: false,
    badgeTag: '🥥 Tropical Delight',
  },
  {
    title: 'Crushed Peanut Laddu / Chikki Bites',
    slug: 'crushed-peanut-laddu-bites',
    subtitle: 'Hand-Rolled Melt-in-Mouth Peanut Energy Spheres',
    description: 'Coarsely crushed roasted peanuts gently rolled with warm, aromatic jaggery and crushed green cardamom into bite-sized energy bites.',
    story: 'For those who prefer a softer, melt-in-the-mouth bite rather than a hard crunch, these traditional laddu bites offer instant energy for kids and elders alike.',
    category: 'Traditional Chikkis',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
    ],
    weightVariants: [
      { weight: '250g (Approx 12 pcs)', price: 120, originalPrice: 145, inStock: true, savingsText: 'Save ₹25' },
      { weight: '500g (Approx 24 pcs)', price: 230, originalPrice: 290, inStock: true, savingsText: 'Save ₹60' },
      { weight: '1kg (Approx 48 pcs)', price: 430, originalPrice: 580, inStock: true, savingsText: 'Save ₹150' },
    ],
    highlights: [
      '100% Vegetarian',
      'High Protein (14.8g / 100g)',
      'Rich in Iron',
      'No Added Sugar',
      'Easy Chew Texture',
    ],
    trustBadges: [
      { icon: 'Smile', label: 'Kids & Seniors Friendly' },
      { icon: 'Zap', label: 'Instant Energy' },
      { icon: 'ShieldCheck', label: 'Handmade Daily' },
    ],
    ingredients: [
      'Crushed Roasted Peanuts (66%)',
      'Native Golden Jaggery (31%)',
      'Pure Ghee (2%)',
      'Fresh Cardamom (1%)',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '525 kcal',
      protein: '14.8g',
      carbohydrates: '50.2g',
      dietaryFiber: '5.5g',
      iron: '4.8mg',
      calcium: '90mg',
      addedSugar: '0g',
    },
    shelfLife: '60 Days from packaging',
    storageAdvice: 'Store in airtight box at room temperature.',
    rating: 4.9,
    reviewCount: 153,
    isFeatured: false,
    isBestseller: true,
    badgeTag: '🍬 Soft Chew',
  },
  {
    title: 'Roasted Flaxseed Jaggery Laddu (Alsi Energy Bites)',
    slug: 'flaxseed-jaggery-laddu-bites',
    subtitle: 'Omega-3 Superfood Snack with Roasted Flaxseeds & Desi Jaggery',
    description: 'Hand-rolled golden roasted flaxseeds (Alsi) and roasted seeds folded in rich aromatic jaggery, loaded with natural Omega-3s and iron.',
    story: 'Specially created for fitness enthusiasts, runners, and working professionals who seek natural plant-based omega-3s, magnesium, and sustained blood sugar stability.',
    category: 'Seed & Healthy',
    image: '/images/flaxseed-laddu.jpg',
    gallery: [
      '/images/flaxseed-laddu.jpg',
    ],
    weightVariants: [
      { weight: '250g', price: 145, originalPrice: 180, inStock: true, savingsText: 'Save ₹35' },
      { weight: '500g', price: 280, originalPrice: 360, inStock: true, savingsText: 'Save ₹80' },
      { weight: '1kg', price: 530, originalPrice: 720, inStock: true, savingsText: 'Save ₹190' },
    ],
    highlights: [
      '100% Vegetarian',
      'Plant-based Omega-3 & Lignans',
      'High Dietary Fiber (11.2g)',
      'Rich in Iron & Magnesium',
      'Zero Glucose Syrup',
    ],
    trustBadges: [
      { icon: 'Activity', label: 'Superfood Power' },
      { icon: 'ShieldCheck', label: 'Low Glycemic Index' },
      { icon: 'Award', label: 'Gym & Fitness Snack' },
    ],
    ingredients: [
      'Roasted Golden Flaxseeds (35%)',
      'Roasted Pumpkin & Sunflower Seeds (25%)',
      'Organic Jaggery (35%)',
      'Cinnamon & Nutmeg (5%)',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '485 kcal',
      protein: '15.5g',
      carbohydrates: '44.0g',
      dietaryFiber: '11.2g',
      iron: '6.8mg (48% RDA)',
      calcium: '180mg (22% RDA)',
      addedSugar: '0g',
    },
    shelfLife: '90 Days from packaging',
    storageAdvice: 'Store in a dry airtight container.',
    rating: 4.8,
    reviewCount: 112,
    isFeatured: true,
    isBestseller: false,
    badgeTag: '🌱 Superfood',
  },
  {
    title: 'Vinayaka Heritage Festive Gift Hamper',
    slug: 'vinayaka-heritage-festive-gift-hamper',
    subtitle: 'Assorted 4-Flavor Collection in Traditional Brass Box',
    description: 'An exquisite hand-embossed traditional gift box packed with Peanut Chikki (250g), Sesame Til Chikki (250g), Royal Dry Fruit Chikki (250g), and Coconut Bites (250g).',
    story: 'The ultimate celebration box for Diwali, Sankranti, weddings, and corporate gifting. Packed with eco-friendly earthen clay sleeves and sealed for 90-day crisp freshness.',
    category: 'Festive Hampers',
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=800&auto=format&fit=crop',
    ],
    weightVariants: [
      { weight: '1kg (4 Assorted Flavors × 250g)', price: 549, originalPrice: 720, inStock: true, savingsText: 'Save ₹171 (Gift Ready)' },
      { weight: '2kg Royal Grand Hamper', price: 999, originalPrice: 1400, inStock: true, savingsText: 'Save ₹401 + Free Express Shipping' },
    ],
    highlights: [
      '100% Vegetarian',
      'Includes 4 Handcrafted Flavors',
      'Rich in Iron & Natural Proteins',
      'Zero Preservatives',
      'Artisanal Gift Box Packaging Included',
    ],
    trustBadges: [
      { icon: 'Gift', label: 'Complimentary Gift Card' },
      { icon: 'Truck', label: 'Free Priority Shipping' },
      { icon: 'Sparkles', label: 'Artisan Sealed' },
    ],
    ingredients: [
      'Assorted Groundnuts, Sesame, California Almonds, Cashews, Coconut, Organic Palm & Cane Jaggery',
    ],
    nutritionalInfo: {
      servingSize: '100g',
      energy: '525 kcal',
      protein: '14.9g',
      carbohydrates: '48.0g',
      dietaryFiber: '6.8g',
      iron: '5.2mg',
      calcium: '115mg',
      addedSugar: '0g',
    },
    shelfLife: '90 Days',
    storageAdvice: 'Store in cool ambient conditions.',
    rating: 5.0,
    reviewCount: 284,
    isFeatured: true,
    isBestseller: true,
    badgeTag: '🎁 Best for Gifting',
  },
];

const sampleUser = {
  name: 'Demo Customer',
  email: 'demo@vinayakachikkis.com',
  password: 'password123',
  phone: '9876543210',
  role: 'customer',
  addresses: [
    {
      title: 'Home',
      street: 'Flat 402, Sri Vinayaka Nilayam, Ring Road',
      landmark: 'Near Sri Ram Mandir',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520008',
      isDefault: true,
    },
    {
      title: 'Office',
      street: 'Cyber Gateway Tower B, HITEC City',
      landmark: 'Opposite Cyber Towers',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      isDefault: false,
    },
  ],
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing product & user collection...');
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding initial products...');
    await Product.insertMany(sampleProducts);

    console.log('Seeding demo user...');
    await User.create(sampleUser);

    console.log('✅ Seeding completed successfully!');
    console.log(`- ${sampleProducts.length} artisanal products seeded`);
    console.log(`- Demo user created: demo@vinayakachikkis.com / password123`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};

// If run directly via node seeders/seedData.js
if (require.main === module) {
  seedData().then(() => {
    process.exit(0);
  });
}

module.exports = { seedData, sampleProducts };
