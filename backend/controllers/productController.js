const mongoose = require('mongoose');
const Product = require('../models/Product');
const { sampleProducts } = require('../seeders/seedData');

// In-memory catalog state for instant updates when DB in fallback
let currentProducts = [...sampleProducts];

// @desc    Fetch all products with optional filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, highlight, sort } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let list = [...currentProducts];
      if (category && category !== 'All') {
        list = list.filter((p) => p.category === category);
      }
      if (highlight) {
        list = list.filter((p) => p.highlights?.includes(highlight));
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.ingredients?.some((i) => i.toLowerCase().includes(s))
        );
      }
      if (sort === 'price-low') {
        list.sort((a, b) => a.weightVariants[0].price - b.weightVariants[0].price);
      } else if (sort === 'price-high') {
        list.sort((a, b) => b.weightVariants[0].price - a.weightVariants[0].price);
      } else if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'bestseller') {
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      }
      return res.json(list);
    }

    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (highlight) {
      query.highlights = { $in: [highlight] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { highlights: { $regex: search, $options: 'i' } },
        { ingredients: { $regex: search, $options: 'i' } },
      ];
    }

    let productQuery = Product.find(query);
    if (sort === 'price-low') {
      productQuery = productQuery.sort({ 'weightVariants.0.price': 1 });
    } else if (sort === 'price-high') {
      productQuery = productQuery.sort({ 'weightVariants.0.price': -1 });
    } else if (sort === 'rating') {
      productQuery = productQuery.sort({ rating: -1 });
    } else if (sort === 'bestseller') {
      productQuery = productQuery.sort({ isBestseller: -1, rating: -1 });
    } else {
      productQuery = productQuery.sort({ isFeatured: -1, createdAt: -1 });
    }

    const products = await productQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:identifier
// @access  Public
const getProductByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const product = currentProducts.find((p) => p.slug === identifier || p._id === identifier);
      if (product) return res.json(product);
      return res.status(404).json({ message: 'Product not found' });
    }

    let product;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }
    if (!product) {
      product = await Product.findOne({ slug: identifier });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product (Admin)
// @route   POST /api/products
// @access  Public / Admin
const createProduct = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      story,
      category,
      image,
      weightVariants,
      highlights,
      ingredients,
      badgeTag,
      isFeatured,
      isBestseller,
    } = req.body;

    if (!title || !description || !category || !weightVariants || weightVariants.length === 0) {
      return res.status(400).json({ message: 'Please provide title, description, category, and weight variants with prices' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProductData = {
      _id: 'prod-' + Date.now(),
      title,
      slug,
      subtitle: subtitle || '',
      description,
      story: story || '',
      category,
      image: image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
      weightVariants: weightVariants.map((v) => ({
        weight: v.weight,
        price: Number(v.price),
        originalPrice: Number(v.originalPrice || Math.round(v.price * 1.25)),
        inStock: v.inStock !== false,
        savingsText: v.savingsText || (v.originalPrice > v.price ? `Save ₹${v.originalPrice - v.price}` : ''),
      })),
      highlights: highlights || ['100% Vegetarian', 'High Protein', 'Rich in Iron', 'Zero White Sugar'],
      ingredients: ingredients || ['Groundnuts', 'Organic Jaggery', 'Cardamom'],
      nutritionalInfo: req.body.nutritionalInfo || {
        servingSize: '100g',
        energy: '520 kcal',
        protein: '14.5g',
        carbohydrates: '50.0g',
        iron: '5.0mg',
        calcium: '100mg',
        addedSugar: '0g',
      },
      shelfLife: req.body.shelfLife || '90 Days from packaging',
      rating: 5.0,
      reviewCount: 1,
      badgeTag: badgeTag || '✨ New Batch',
      isFeatured: !!isFeatured,
      isBestseller: !!isBestseller,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(newProductData);
      return res.status(201).json(product);
    } else {
      currentProducts.unshift(newProductData);
      return res.status(201).json(newProductData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product details and price (Admin)
// @route   PUT /api/products/:id
// @access  Public / Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState === 1) {
      let product;
      if (String(id).match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      } else {
        product = await Product.findOne({ $or: [{ _id: id }, { slug: id }] });
      }

      if (!product) {
        // Check in-memory fallback list
        const fallbackIdx = currentProducts.findIndex((p) => p._id === id || p.slug === id);
        if (fallbackIdx !== -1) {
          currentProducts[fallbackIdx] = { ...currentProducts[fallbackIdx], ...updates };
          return res.json(currentProducts[fallbackIdx]);
        }
        return res.status(404).json({ message: 'Product not found' });
      }

      Object.assign(product, updates);
      if (updates.weightVariants) {
        product.weightVariants = updates.weightVariants.map((v) => ({
          weight: v.weight,
          price: Number(v.price),
          originalPrice: Number(v.originalPrice || Math.round(v.price * 1.25)),
          inStock: v.inStock !== false,
          savingsText: v.savingsText || (v.originalPrice > v.price ? `Save ₹${v.originalPrice - v.price}` : ''),
        }));
      }

      const updated = await product.save();
      return res.json(updated);
    } else {
      const index = currentProducts.findIndex((p) => p._id === id || p.slug === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updated = {
        ...currentProducts[index],
        ...updates,
        weightVariants: updates.weightVariants
          ? updates.weightVariants.map((v) => ({
              weight: v.weight,
              price: Number(v.price),
              originalPrice: Number(v.originalPrice || Math.round(v.price * 1.25)),
              inStock: v.inStock !== false,
              savingsText: v.savingsText || (v.originalPrice > v.price ? `Save ₹${v.originalPrice - v.price}` : ''),
            }))
          : currentProducts[index].weightVariants,
      };
      currentProducts[index] = updated;
      return res.json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Public / Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let product;
      if (String(id).match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      } else {
        product = await Product.findOne({ $or: [{ _id: id }, { slug: id }] });
      }

      if (product) {
        await product.deleteOne();
      }
      currentProducts = currentProducts.filter((p) => p._id !== id && p.slug !== id);
      return res.json({ message: 'Product removed successfully' });
    } else {
      currentProducts = currentProducts.filter((p) => p._id !== id && p.slug !== id);
      return res.json({ message: 'Product removed successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
};
